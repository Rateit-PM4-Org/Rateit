package ch.zhaw.rateit.api.logic.user.controller;

import ch.zhaw.rateit.api.logic.user.service.UserService;
import ch.zhaw.rateit.api.logic.user.entity.User;
import ch.zhaw.rateit.api.logic.user.entity.UserRegistrationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(path = "/register")
    public User register(@RequestBody UserRegistrationRequest userRegistrationRequest) {
        return userService.register(userRegistrationRequest);
    }
}
