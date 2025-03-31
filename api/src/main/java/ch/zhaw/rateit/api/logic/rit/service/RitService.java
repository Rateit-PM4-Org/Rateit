package ch.zhaw.rateit.api.logic.rit.service;

import ch.zhaw.rateit.api.logic.rit.entity.Rating;
import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.rit.entity.RitCreateRequest;
import ch.zhaw.rateit.api.logic.rit.entity.RitRateRequest;
import ch.zhaw.rateit.api.logic.rit.repository.RitRepository;
import ch.zhaw.rateit.api.logic.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;


/**
 * Service to handle interactions with rits.
 *
 * @author Micha Mettler
 */
@Service
public class RitService {
    private final RitRepository ritRepository;

    @Autowired
    public RitService(RitRepository ritRepository) {
        this.ritRepository = ritRepository;
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

    public Rit rate(User user, RitRateRequest request) {
        Rit rit = ritRepository.getRitById(request.ritId());
        Rating rating = new Rating(
                request.value(),
                request.comment(),
                user,
                Instant.now()
        );
        rit.addRating(rating);
        ritRepository.save(rit);
        return ritRepository.getRitById(rit.getId());
    }

}
