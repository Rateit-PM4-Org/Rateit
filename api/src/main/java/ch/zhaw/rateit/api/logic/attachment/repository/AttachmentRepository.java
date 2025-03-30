package ch.zhaw.rateit.api.logic.attachment.repository;

import ch.zhaw.rateit.api.logic.attachment.entity.Attachment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttachmentRepository extends MongoRepository<Attachment, String> {
}
