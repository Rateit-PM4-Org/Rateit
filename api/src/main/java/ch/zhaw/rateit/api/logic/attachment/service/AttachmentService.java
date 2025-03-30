package ch.zhaw.rateit.api.logic.attachment.service;

import ch.zhaw.rateit.api.exceptions.types.ValidationExceptionWithField;
import ch.zhaw.rateit.api.logic.attachment.entity.Attachment;
import ch.zhaw.rateit.api.logic.attachment.entity.AttachmentCreateRequest;
import ch.zhaw.rateit.api.logic.attachment.repository.AttachmentRepository;
import ch.zhaw.rateit.api.logic.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;

/**
 * Handles Attachment-Requests and Logic
 *
 * @author Achille Hünenberger
 */
@Service
public class AttachmentService {
    private static final long MAX_IMAGE_SIZE = 8L * 1024 * 1024; // 8 MB

    private final AttachmentRepository attachmentRepository;

    @Autowired
    public AttachmentService(AttachmentRepository attachmentRepository) {
        this.attachmentRepository = attachmentRepository;
    }

    /**
     * Create an Image-Attachment:
     * - save Ref in DB
     * - upload to Object-Storage
     *
     * @param user
     * @param attachmentCreateRequest
     * @return
     */
    public Attachment createImageAttachement(User user, AttachmentCreateRequest attachmentCreateRequest) {

        validateImage(attachmentCreateRequest.file());

        // TODO save to Object Storage and get URL

        Attachment attachment = new Attachment(
                "URL_PLACEHOLDER", // TODO fill out
                Attachment.AttachmentType.IMAGE,
                user
        );

        attachment = attachmentRepository.save(attachment);
        return attachment;
    }

    /**
     * Validate, that file is an image and is accepted
     *
     * @param file
     */
    private void validateImage(MultipartFile file) {
        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new ValidationExceptionWithField(new ValidationExceptionWithField.ValidationError("file", "exceeds the maximum size of 8 MB."));
        }

        try {
            BufferedImage image = ImageIO.read(file.getInputStream());
            if (image == null) {
                throw new ValidationExceptionWithField(new ValidationExceptionWithField.ValidationError("file", "is not a valid image."));
            }
        } catch (IOException e) {
            throw new ValidationExceptionWithField(new ValidationExceptionWithField.ValidationError("file", "is not a valid image."));
        }
    }
}
