package ch.zhaw.rateit.api.logic.rit.service;

import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.rit.entity.RitCreateRequest;
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

    private static final int MAX_IMAGE_SIZE = 500_000;

    @Autowired
    public RitService(RitRepository ritRepository) {
        this.ritRepository = ritRepository;
    }

    public Rit create(User user, RitCreateRequest request) {
        validateImage(request.image());

        Rit rit = new Rit(
                request.name(),
                user.getId(),
                request.image(),
                request.details(),
                request.published()
        );

        return ritRepository.save(rit);
    }

    private void validateImage(String image) {
        if (image == null) return;

        if (image.length() > MAX_IMAGE_SIZE) {
            throw new IllegalArgumentException("Image is too large (max " + MAX_IMAGE_SIZE + " characters base64).");
        }

        if (!image.matches("^data:image/[^;]+;base64,.*$")) {
            throw new IllegalArgumentException("Invalid image format.");
        }
    }

}
