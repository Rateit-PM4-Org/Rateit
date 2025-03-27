package ch.zhaw.rateit.api.logic.mail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestMailController {

    @Autowired
    private MailService mailService;

    @GetMapping("/send-test-email")
    public String sendTestEmail(@RequestParam String to) {
        mailService.sendEmail(to, "Rateit PM4 - Test Mail", "This is a test email sent via REST endpoint.");
        return "Test email sent to " + to;
    }
}
