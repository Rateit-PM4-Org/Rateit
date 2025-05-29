package ch.zhaw.rateit.api.logic.rit.service;

import ch.zhaw.rateit.api.logic.rit.entity.Rating;
import ch.zhaw.rateit.api.logic.rit.entity.RatingCreateRequest;
import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.rit.entity.RitCreateRequest;
import ch.zhaw.rateit.api.logic.rit.repository.RatingRepository;
import ch.zhaw.rateit.api.logic.rit.repository.RitRepository;
import ch.zhaw.rateit.api.logic.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Service class for managing Rits and their associated ratings.
 *
 * @author Micha Mettler
 */
@Service
public class RitService {
    private final RitRepository ritRepository;
    private final RatingRepository ratingRepository;

    @Autowired
    public RitService(RitRepository ritRepository, RatingRepository ratingRepository) {
        this.ritRepository = ritRepository;
        this.ratingRepository = ratingRepository;
    }

    /**
     * Creates a new Rit entity, associates it with the provided owner, and saves it to the repository.
     *
     * @param owner   The User entity representing the owner of the Rit.
     * @param request The RitCreateRequest object containing the details for creating the Rit.
     * @return The newly created and saved Rit entity retrieved from the repository.
     */
    public Rit create(User owner, RitCreateRequest request) {
        Rit rit = new Rit(
                request.name(),
                request.details(),
                request.tags(),
                request.codes(),
                owner
        );

        ritRepository.save(rit);
        return ritRepository.getRitById(rit.getId());
    }

    /**
     * Retrieves all Rit entities associated with the specified owner, ordered by the
     * last updated timestamp in descending order.
     *
     * @param owner The User entity representing the owner of the Rits to be retrieved.
     * @return A list of Rit entities associated with the given owner, sorted by their
     * updated timestamp in descending order.
     */
    public List<Rit> getAll(User owner) {
        return ritRepository.findAllByOwnerOrderByUpdatedAtDesc(owner);
    }

    /**
     * Retrieves a specific Rit identified by its ID, ensuring that the given user has permission to access it.
     *
     * @param owner The User entity representing the requester attempting to access the Rit.
     * @param id    The unique identifier of the Rit to be retrieved.
     * @return The Rit entity corresponding to the specified ID if the user has access rights.
     * @throws AccessDeniedException If the given user does not have permission to access the Rit.
     */
    public Rit getRitById(User owner, String id) {
        Rit rit = findRitById(id);

        if (!canUserViewRit(owner, rit)) {
            throw new AccessDeniedException("You don't have access to this rit");
        }

        return rit;
    }

    /**
     * Updates the details of an existing Rit entity identified by its ID, ensuring the given user
     * has permission to update it. The updated Rit is then saved to the repository.
     *
     * @param owner   The User entity representing the owner attempting to update the Rit.
     * @param id      The unique identifier of the Rit to be updated.
     * @param request The RitCreateRequest object containing the updated details for the Rit.
     * @return The updated Rit entity after being saved in the repository.
     * @throws AccessDeniedException If the given user does not have permission to update the Rit.
     */
    public Rit update(User owner, String id, RitCreateRequest request) {
        Rit rit = findRitById(id);

        if (!canUserUpdateRit(owner, rit)) {
            throw new AccessDeniedException("You don't have access to this rit");
        }

        rit.setName(request.name());
        rit.setDetails(request.details());
        rit.setTags(request.tags());
        rit.setCodes(request.codes());
        return ritRepository.save(rit);
    }

    /**
     * Deletes a Rit entity identified by its ID, ensuring the given user has permission to perform the deletion.
     * Also deletes all associated ratings for the Rit.
     *
     * @param owner The User entity representing the owner attempting to delete the Rit.
     * @param id    The unique identifier of the Rit to be deleted.
     * @throws AccessDeniedException If the given user does not have permission to delete the Rit.
     */
    public void deleteRit(User owner, String id) {
        Rit rit = findRitById(id);

        if (!canUserUpdateRit(owner, rit)) {
            throw new AccessDeniedException("You don't have access to this rit");
        }

        ratingRepository.deleteAllByRit(rit);
        ritRepository.delete(rit);
    }

    /**
     * Creates a new rating associated with a specified Rit and saves it to the repository.
     * Ensures that the user has appropriate access rights to the targeted Rit before proceeding.
     *
     * @param owner   The User entity representing the creator of the rating.
     * @param id      The unique identifier of the Rit to be rated.
     * @param request The RatingCreateRequest object containing the details for the new rating,
     *                such as value, positive comment, and negative comment.
     * @return The newly created and saved Rating entity that was stored in the repository.
     * @throws AccessDeniedException If the user does not have permission to view the specified Rit.
     */
    public Rating rate(User owner, String id, RatingCreateRequest request) {
        Rit rit = findRitById(id);

        if (!canUserViewRit(owner, rit)) {
            throw new AccessDeniedException("You don't have access to this rit");
        }

        Rating rating = new Rating(
                request.value(),
                request.positiveComment(),
                request.negativeComment(),
                rit,
                owner
        );

        return ratingRepository.save(rating);
    }

    /**
     * Deletes a rating identified by its ID after verifying that the specified user
     * has the appropriate ownership and access rights.
     *
     * @param owner The User entity representing the owner attempting to delete the rating.
     * @param id    The unique identifier of the rating to be deleted.
     * @throws AccessDeniedException   If the given user does not have ownership of the rating.
     * @throws ResponseStatusException If the rating with the specified ID is not found.
     */
    public void deleteRating(User owner, String id) {
        Rating rating = findRatingById(id);

        if (!rating.getOwner().getId().equals(owner.getId())) {
            throw new AccessDeniedException("You don't have access to this rating");
        }

        ratingRepository.delete(rating);
    }

    private Rit findRitById(String id) {
        return ritRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rit not found"));
    }

    private Rating findRatingById(String id) {
        return ratingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rating not found"));
    }

    /**
     * Determines whether a given user has permission to view a specific Rit.
     * A user can view a Rit if they are the owner of the Rit or if the Rit is published.
     *
     * @param user The User entity making the request to view the Rit.
     * @param rit  The Rit entity that is being accessed.
     * @return true if the user has permission to view the Rit, false otherwise.
     */
    private boolean canUserViewRit(User user, Rit rit) {
        return rit.getOwner().getId().equals(user.getId()) || rit.isPublished();
    }

    /**
     * Determines whether a given user has permission to update a specific Rit.
     * A user can update a Rit only if they are the owner of the Rit.
     *
     * @param user The User entity attempting to update the Rit.
     * @param rit  The Rit entity that is being accessed for update.
     * @return true if the user is the owner of the Rit and has permission to update it, false otherwise.
     */
    private boolean canUserUpdateRit(User user, Rit rit) {
        return rit.getOwner().getId().equals(user.getId());
    }

}
