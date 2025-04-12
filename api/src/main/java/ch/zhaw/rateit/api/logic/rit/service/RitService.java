package ch.zhaw.rateit.api.logic.rit.service;

import ch.zhaw.rateit.api.exceptions.types.ValidationExceptionWithField;
import ch.zhaw.rateit.api.logic.rit.entity.Rating;
import ch.zhaw.rateit.api.logic.rit.entity.RatingCreateRequest;
import ch.zhaw.rateit.api.logic.rit.repository.RatingRepository;
import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.rit.entity.RitCreateRequest;
import ch.zhaw.rateit.api.logic.rit.repository.RitRepository;
import ch.zhaw.rateit.api.logic.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public Rit create(User user, RitCreateRequest request) {
        Rit rit = new Rit(
                request.name(),
                request.details(),
                request.tags(),
                user
        );

        ritRepository.save(rit);
        return ritRepository.getRitById(rit.getId());
    }


    public Rating rate(User owner, RatingCreateRequest request) {
        Rit rit = ritRepository.getRitById(request.rit().getId());
        if (rit == null) {
            throw new ValidationExceptionWithField(new ValidationExceptionWithField.ValidationError("rit", "Rit with id " + request.rit().getId() + " does not exist"));
        }
        if (!rit.getOwner().getId().equals(owner.getId())) {
            throw new ValidationExceptionWithField(new ValidationExceptionWithField.ValidationError("rit", "You are not the owner of this rit"));
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

    public List<Rit> getAll(User user) {
        return ritRepository.findAllByOwner(user);

    }

}
