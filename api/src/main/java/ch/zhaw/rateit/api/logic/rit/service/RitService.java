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

    private static final long MAX_IMAGE_SIZE = 8L * 1024 * 1024; // 8 MB

    @Autowired
    public RitService(RitRepository ritRepository) {
        this.ritRepository = ritRepository;
    }

    public Rit create(User user, RitCreateRequest request) {
        List<MultipartFile> files = request.images();

        if (files != null && !files.isEmpty()) {
            validateImages(files);
        }

        // TODO upload image to MinIO

        Rit rit = new Rit(
                request.name(),
                request.details(),
                null, // TODO change to imageRefs after upload
                request.published(),
                user
        );

        return ritRepository.save(rit);
    }

    private void validateImages(List<MultipartFile> files) {
        if (files.size() > 3) {
            throw new ValidationExceptionWithField(new ValidationExceptionWithField.ValidationError("images", "Maximum of 3 images allowed."));
        }

        for (MultipartFile file : files) {
            if (file.getSize() > MAX_IMAGE_SIZE) {
                throw new ValidationExceptionWithField(new ValidationExceptionWithField.ValidationError("images", "One of the images exceeds the maximum size of 8 MB."));
            }
        }
    }

}
