package ch.zhaw.rateit.api.logic.rit.service;

import ch.zhaw.rateit.api.logic.rit.entity.Rating;
import ch.zhaw.rateit.api.logic.rit.entity.RatingCreateRequest;
import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.rit.entity.RitCreateRequest;
import ch.zhaw.rateit.api.logic.rit.repository.RatingRepository;
import ch.zhaw.rateit.api.logic.rit.repository.RitRepository;
import ch.zhaw.rateit.api.logic.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;


/**
 * Service to handle interactions with rits.
 *
 * @author Micha Mettler
 */
@Service
public class RitService {
    private final RitRepository ritRepository;
    private final RatingRepository ratingRepository;

    @Autowired
    public RitService(RitRepository ritRepository, RatingRepository ratingRepository) {
        this.ritRepository = ritRepository;
        this.ratingRepository = ratingRepository;
    }

    public Rit create(User owner, RitCreateRequest request) {
        Rit rit = new Rit(
                request.name(),
                request.details(),
                request.tags(),
                request.codes(),
                owner
        );

        ritRepository.save(rit);
        return ritRepository.getRitById(rit.getId());
    }

    public Rating rate(User owner, RatingCreateRequest request) {
        Rit rit = findRitById(request.rit().getId());

        if (!canUserViewRit(owner, rit)) {
            throw new AccessDeniedException("You don't have access to this rit");
        }

        Rating rating = new Rating(
                request.value(),
                request.positiveComment(),
                request.negativeComment(),
                rit,
                owner
        );

        return ratingRepository.save(rating);
    }

    public void deleteRating(User owner, String id) {
        Rating rating = findRatingById(id);

        if (!rating.getOwner().getId().equals(owner.getId())) {
            throw new AccessDeniedException("You don't have access to this rating");
        }

        ratingRepository.delete(rating);
    }

    public void deleteRit(User owner, String id) {
        Rit rit = findRitById(id);

        if (!canUserUpdateRit(owner, rit)) {
            throw new AccessDeniedException("You don't have access to this rit");
        }

        ratingRepository.deleteAllByRit(rit);
        ritRepository.delete(rit);
    }

    public List<Rit> getAll(User owner) {
        return ritRepository.findAllByOwnerOrderByUpdatedAtDesc(owner);
    }

    public Rit getRitById(User owner, String id) {
        Rit rit = findRitById(id);

        if (!canUserViewRit(owner, rit)) {
            throw new AccessDeniedException("You don't have access to this rit");
        }

        return rit;
    }

    public Rit update(User owner, String id, RitCreateRequest request) {
        Rit rit = findRitById(id);

        if (!canUserUpdateRit(owner, rit)) {
            throw new AccessDeniedException("You don't have access to this rit");
        }

        rit.setName(request.name());
        rit.setDetails(request.details());
        rit.setTags(request.tags());
        rit.setCodes(request.codes());
        return ritRepository.save(rit);
    }

    private Rit findRitById(String id) {
        return ritRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rit not found"));
    }

    private Rating findRatingById(String id) {
        return ratingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rating not found"));
    }

    private boolean canUserViewRit(User user, Rit rit) {
        return rit.getOwner().getId().equals(user.getId()) || rit.isPublished();
    }

    private boolean canUserUpdateRit(User user, Rit rit) {
        return rit.getOwner().getId().equals(user.getId());
    }

}
