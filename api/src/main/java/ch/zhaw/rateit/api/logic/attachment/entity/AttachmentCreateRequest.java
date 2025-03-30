package ch.zhaw.rateit.api.logic.attachment.entity;

import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

/**
 * Request object for creating a new attachment.
 * Contains the file from Multipart
 *
 */
public record AttachmentCreateRequest(
        @NotNull MultipartFile file
) { }
