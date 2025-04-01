package ch.zhaw.rateit.api.logic.rit.service;

import ch.zhaw.rateit.api.logic.rit.entity.Rating;
import ch.zhaw.rateit.api.logic.rit.entity.RatingRequest;
import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.rit.entity.RitCreateRequest;
import ch.zhaw.rateit.api.logic.rit.repository.RatingRepository;
import ch.zhaw.rateit.api.logic.rit.repository.RitRepository;
import ch.zhaw.rateit.api.logic.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


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
                request.images(),
                request.published(),
                user
        );

        ritRepository.save(rit);
        return ritRepository.getRitById(rit.getId());
    }

    public Rating rate(User owner, RatingRequest request) {
        Rit rit = ritRepository.getRitById(request.ritId());

        Rating rating = new Rating(
                request.value(),
                request.positive(),
                request.negative(),
                rit,
                owner
        );

        return ratingRepository.save(rating);
    }

}
