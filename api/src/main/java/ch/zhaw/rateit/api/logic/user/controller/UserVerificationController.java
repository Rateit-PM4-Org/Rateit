package ch.zhaw.rateit.api.logic.user.controller;

import ch.zhaw.rateit.api.logic.user.service.UserVerificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserVerificationController {
    private final UserVerificationService userVerificationService;

    public UserVerificationController(UserVerificationService userVerificationService) {
        this.userVerificationService = userVerificationService;
    }

    @GetMapping("/confirm")
    public ResponseEntity<String> verifyUser(
            @RequestParam String email,
            @RequestParam String token
    ) {
        boolean isVerified = userVerificationService.verifyUser(email, token);

        if (isVerified) {
            return ResponseEntity.ok("Email verified successfully. You can now log in.");
        } else {
            return ResponseEntity.badRequest().body("Email verification failed. Invalid token or email.");
        }
    }
}