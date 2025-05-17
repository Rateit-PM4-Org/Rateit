package ch.zhaw.rateit.api.logic.attachment.controller;

import ch.zhaw.rateit.api.logic.attachment.entity.Attachment;
import ch.zhaw.rateit.api.logic.attachment.entity.AttachmentCreateRequest;
import ch.zhaw.rateit.api.logic.attachment.service.AttachmentService;
import ch.zhaw.rateit.api.logic.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller to handle interactions with Attachments.
 * Actual Attachments are always located at URL.
 *
 * @author Achille Hünenberger
 */
@RestController
@RequestMapping("/api/attachments")
@Validated
public class AttachmentController {

    private final AttachmentService attachmentService;

    @Autowired
    public AttachmentController(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @PostMapping(path = "/images", consumes = "multipart/form-data")
    public Attachment createImage(@AuthenticationPrincipal User user, @ModelAttribute @Validated AttachmentCreateRequest attachmentCreateRequest) {
        return attachmentService.createImageAttachement(user, attachmentCreateRequest);
    }

}
