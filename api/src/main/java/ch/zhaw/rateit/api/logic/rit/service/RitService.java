package ch.zhaw.rateit.api.logic.rit.service;

import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.rit.entity.RitCreateRequest;
import ch.zhaw.rateit.api.logic.rit.repository.RitRepository;
import ch.zhaw.rateit.api.logic.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;


/**
 * Service to handle interactions with rits.
 *
 * @author Micha Mettler
 */
@Service
public class RitService {
    private final RitRepository ritRepository;

    @Autowired
    public RitService(RitRepository ritRepository) {
        this.ritRepository = ritRepository;
    }

    public Rit create(User user, RitCreateRequest request) {
        Rit rit = new Rit(
                request.name(),
                request.details(),
                request.tags(),
                user
        );

        ritRepository.save(rit);
        return ritRepository.getRitById(rit.getId());
    }

    public List<Rit> getAll(User user) {
        return ritRepository.findAllByOwner(user);
    }

    public Rit findRitById(User user, String id) {
        Rit rit = findRitById(id);

        if (!canUserViewRit(user, rit)) {
            throw new AccessDeniedException("You don't have access to this rit");
        }

        return rit;
    }

    public Rit update(User user, String id, RitCreateRequest request) {
        Rit rit = findRitById(id);

        if (!canUserUpdateRit(user, rit)) {
            throw new AccessDeniedException("You don't have access to this rit");
        }

        rit.setName(request.name());
        rit.setDetails(request.details());
        rit.setTags(request.tags());
        return ritRepository.save(rit);
    }

    private Rit findRitById(String id) {
        return ritRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rit not found"));
    }

    private boolean canUserViewRit(User user, Rit rit) {
        return rit.getOwner().getId().equals(user.getId()) || rit.isPublished();
    }

    private boolean canUserUpdateRit(User user, Rit rit) {
        return rit.getOwner().getId().equals(user.getId());
    }

}
