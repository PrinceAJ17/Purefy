package team.bham.service;

import java.util.List;
import java.util.Optional;
import javax.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.Points;
import team.bham.repository.PointsRepository;

/**
 * Service Implementation for managing {@link Points}.
 */
@Service
@Transactional
public class PointsService {

    private final Logger log = LoggerFactory.getLogger(PointsService.class);

    private final PointsRepository pointsRepository;

    @Autowired
    public PointsService(PointsRepository pointsRepository) {
        this.pointsRepository = pointsRepository;
    }

    public Points updatePoints(String username, int pointsToAdd) {
        Points points = pointsRepository
            .findByUsername(username)
            .orElseGet(() -> {
                Points newPoints = new Points();
                newPoints.setUsername(username); // Set username
                newPoints.setCurrentPoints(0); // Initialize current points
                newPoints.setTotalPoints(0); // Initialize total points
                newPoints.setPreviousPoints(0); //Initialize previous points.
                return newPoints;
            });

        points.setCurrentPoints(pointsToAdd); // Overwrite current points
        points.setTotalPoints(points.getTotalPoints() + pointsToAdd); // Increment total points
        return pointsRepository.save(points);
    }

    public Points deductPoints(String username, int pointsToDeduct) {
        Points points = pointsRepository.findByUsername(username).orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Calculate new current points ensuring it doesn't go below 0
        int newCurrentPoints = Math.max(0, points.getCurrentPoints() - pointsToDeduct);

        // Calculate new total points ensuring it doesn't go below 0
        int newTotalPoints = Math.max(0, points.getTotalPoints() - pointsToDeduct);

        points.setCurrentPoints(newCurrentPoints);
        points.setTotalPoints(newTotalPoints);

        return pointsRepository.save(points);
    }

    /**
     * Save a points.
     *
     * @param points the entity to save.
     * @return the persisted entity.
     */
    public Points save(Points points) {
        log.debug("Request to save Points : {}", points);
        return pointsRepository.save(points);
    }

    /**
     * Update a points.
     *
     * @param points the entity to save.
     * @return the persisted entity.
     */
    public Points update(Points points) {
        log.debug("Request to update Points : {}", points);
        return pointsRepository.save(points);
    }

    /**
     * Partially update a points.
     *
     * @param points the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Points> partialUpdate(Points points) {
        log.debug("Request to partially update Points : {}", points);

        return pointsRepository
            .findById(points.getId())
            .map(existingPoints -> {
                if (points.getUsername() != null) {
                    existingPoints.setUsername(points.getUsername());
                }
                if (points.getCurrentPoints() != null) {
                    existingPoints.setCurrentPoints(points.getCurrentPoints());
                }
                if (points.getPreviousPoints() != null) {
                    existingPoints.setPreviousPoints(points.getPreviousPoints());
                }
                if (points.getTotalPoints() != null) {
                    existingPoints.setTotalPoints(points.getTotalPoints());
                }

                return existingPoints;
            })
            .map(pointsRepository::save);
    }

    /**
     * Get all the points.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Points> findAll() {
        log.debug("Request to get all Points");
        return pointsRepository.findAll();
    }

    /**
     * Get one points by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Points> findOne(Long id) {
        log.debug("Request to get Points : {}", id);
        return pointsRepository.findById(id);
    }

    /**
     * Delete the points by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Points : {}", id);
        pointsRepository.deleteById(id);
    }
}
