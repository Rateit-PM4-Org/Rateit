package ch.zhaw.rateit.api.logic.mail;

/**
 * Interface for handling email operations. Provides functionality for sending emails
 * to specified recipients with a given subject and message body.
 *
 * @author Fabio Huber
 */
public interface MailService {

    /**
     * Sends an email to the given recipient.
     *
     * @param recipient the recipient of the email
     * @param subject   the subject of the email
     * @param text      the text of the email
     */
    void sendEmail(String recipient, String subject, String text);
}
