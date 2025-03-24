package ch.zhaw.rateit.api.logic.user;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Class to handle password encoder globally.
 *
 * @author Nicolas Zillig
 */
@Configuration
public class PasswordEncrypterConfiguration {
    @Bean
    public BCryptPasswordEncoder getPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
