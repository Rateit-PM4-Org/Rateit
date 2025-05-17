package ch.zhaw.rateit.api.logic.rit.controller;

import ch.zhaw.rateit.api.logic.rit.entity.Rating;
import ch.zhaw.rateit.api.logic.rit.entity.RatingCreateRequest;
import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.rit.entity.RitCreateRequest;
import ch.zhaw.rateit.api.logic.rit.service.RitService;
import ch.zhaw.rateit.api.logic.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller to handle interactions with rits.
 *
 * @author Micha Mettler
 */
@RestController
@RequestMapping("/api/rits")
@Validated
public class RitController {

    private final RitService ritService;

    @Autowired
    public RitController(RitService ritService) {
        this.ritService = ritService;
    }

    @PostMapping
    public Rit createRit(@AuthenticationPrincipal User user, @RequestBody @Validated RitCreateRequest request) {
        return ritService.create(user, request);
    }

    @GetMapping("/{id}")
    public Rit getRit(@AuthenticationPrincipal User user, @PathVariable String id) {
        return ritService.getRitById(user, id);
    }

    @GetMapping
    public List<Rit> getAllRits(@AuthenticationPrincipal User user) {
        return ritService.getAll(user);
    }

    @PutMapping("/{id}")
    public Rit updateRit(@AuthenticationPrincipal User user, @PathVariable String id, @RequestBody @Validated RitCreateRequest request) {
        return ritService.update(user, id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteRit(@AuthenticationPrincipal User user, @PathVariable String id) {
        ritService.deleteRit(user, id);
    }

    @PostMapping("/{id}/ratings")
    public Rating createRating(@AuthenticationPrincipal User user, @PathVariable String id, @RequestBody @Validated RatingCreateRequest request) {
        return ritService.rate(user, id, request);
    }

    @DeleteMapping("/{id}/ratings/{ratingId}")
    public void deleteRating(@AuthenticationPrincipal User user, @PathVariable String ratingId) {
        ritService.deleteRating(user, ratingId);
    }

}
