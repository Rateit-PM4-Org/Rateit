package ch.zhaw.rateit.api.logic.user;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordEncrypter {
    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    public BCryptPasswordEncoder getPasswordEncoder() {
        return passwordEncoder;
    }
}
