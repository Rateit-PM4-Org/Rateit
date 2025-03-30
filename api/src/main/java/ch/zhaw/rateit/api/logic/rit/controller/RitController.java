package ch.zhaw.rateit.api.logic.rit.controller;

import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.rit.entity.RitCreateRequest;
import ch.zhaw.rateit.api.logic.rit.service.RitService;
import ch.zhaw.rateit.api.logic.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

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

    @PostMapping(path = "/create", consumes = "multipart/form-data")
    public Rit create(@AuthenticationPrincipal User user, @ModelAttribute @Validated RitCreateRequest request) {
        return ritService.create(user, request);
    }

}
