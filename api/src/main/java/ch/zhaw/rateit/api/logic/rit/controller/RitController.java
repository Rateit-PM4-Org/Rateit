package ch.zhaw.rateit.api.logic.rit.controller;

import ch.zhaw.rateit.api.logic.rit.entity.Rating;
import ch.zhaw.rateit.api.logic.rit.entity.RatingRequest;
import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.rit.entity.RitCreateRequest;
import ch.zhaw.rateit.api.logic.rit.service.RitService;
import ch.zhaw.rateit.api.logic.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * Controller to handle interactions with rits.
 *
 * @author Micha Mettler
 */
@RestController
@RequestMapping("/rit")
@Validated
public class RitController {

    private final RitService ritService;

    @Autowired
    public RitController(RitService ritService) {
        this.ritService = ritService;
    }

    @PostMapping(path = "/create")
    public Rit create(@AuthenticationPrincipal User user, @RequestBody @Validated RitCreateRequest request) {
        return ritService.create(user, request);
    }

    @PostMapping(path = "/rate")
    public Rating rate(@AuthenticationPrincipal User user, @RequestBody @Validated RatingRequest request) {
        return ritService.rate(user, request);
    }

}
