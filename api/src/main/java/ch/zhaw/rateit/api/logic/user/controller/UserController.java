package ch.zhaw.rateit.api.logic.user.controller;

import ch.zhaw.rateit.api.config.auth.TokenResponse;
import ch.zhaw.rateit.api.logic.user.entity.UserLoginRequest;
import ch.zhaw.rateit.api.logic.user.service.UserLoginService;
import ch.zhaw.rateit.api.logic.user.service.UserRegistrationService;
import ch.zhaw.rateit.api.logic.user.entity.User;
import ch.zhaw.rateit.api.logic.user.entity.UserRegistrationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller to handle interactions with users.
 *
 * @author Nicolas Zillig
 */
@RestController
@RequestMapping("/user")
public class UserController {

    private final UserRegistrationService userRegistrationService;
    private final UserLoginService userLoginService;

    @Autowired
    public UserController(UserRegistrationService userRegistrationService, UserLoginService userLoginService) {
        this.userRegistrationService = userRegistrationService;
        this.userLoginService = userLoginService;
    }

    @PostMapping(path = "/register")
    public User register(@RequestBody UserRegistrationRequest userRegistrationRequest) {
        return userRegistrationService.register(userRegistrationRequest);
    }

    @PostMapping(path = "/login")
    public TokenResponse login(@RequestBody @Validated UserLoginRequest userLoginRequest) {
        return userLoginService.verifyLoginAndGetToken(userLoginRequest);
    }
}
