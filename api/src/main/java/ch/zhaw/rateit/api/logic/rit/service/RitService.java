package ch.zhaw.rateit.api.logic.rit.service;

import ch.zhaw.rateit.api.exceptions.types.ValidationExceptionWithField;
import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.rit.entity.RitCreateRequest;
import ch.zhaw.rateit.api.logic.rit.repository.RitRepository;
import ch.zhaw.rateit.api.logic.user.entity.User;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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

        return ritRepository.save(rit);
    }

}
