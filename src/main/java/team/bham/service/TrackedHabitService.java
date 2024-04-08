package team.bham.service;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.TrackedHabit;
import team.bham.repository.TrackedHabitRepository;

@Service
@Transactional
public class TrackedHabitService {

    private final Logger log = LoggerFactory.getLogger(TrackedHabitService.class);
    private final TrackedHabitRepository trackedHabitRepository;
    private final HabitService habitService; // Injecting HabitService

    public TrackedHabitService(TrackedHabitRepository trackedHabitRepository, HabitService habitService) {
        this.trackedHabitRepository = trackedHabitRepository;
        this.habitService = habitService; // Initializing HabitService
    }

    public TrackedHabit save(TrackedHabit trackedHabit) {
        log.debug("Request to save TrackedHabit : {}", trackedHabit);
        return trackedHabitRepository.save(trackedHabit);
    }

    @Transactional(readOnly = true)
    public List<TrackedHabit> findAll() {
        log.debug("Request to get all TrackedHabits");
        return trackedHabitRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<TrackedHabit> findOne(Long id) {
        log.debug("Request to get TrackedHabit : {}", id);
        return trackedHabitRepository.findById(id);
    }

    public void delete(Long id) {
        log.debug("Request to delete TrackedHabit : {}", id);
        trackedHabitRepository.deleteById(id);
    }

    public TrackedHabit update(TrackedHabit trackedHabit) {
        log.debug("Request to update TrackedHabit : {}", trackedHabit);
        return trackedHabitRepository.save(trackedHabit);
    }

    public Optional<TrackedHabit> partialUpdate(TrackedHabit trackedHabit) {
        log.debug("Request to partially update TrackedHabit : {}", trackedHabit);
        return trackedHabitRepository
            .findById(trackedHabit.getId())
            .map(existingTrackedHabit -> {
                if (trackedHabit.getCompleted() != null) {
                    existingTrackedHabit.setCompleted(trackedHabit.getCompleted());
                }
                if (trackedHabit.getTrackedHabitID() != null) {
                    existingTrackedHabit.setTrackedHabitID(trackedHabit.getTrackedHabitID());
                }
                if (trackedHabit.getRel1() != null) {
                    existingTrackedHabit.setRel1(trackedHabit.getRel1());
                }
                if (trackedHabit.getRel2() != null) {
                    existingTrackedHabit.setRel2(trackedHabit.getRel2());
                }
                return existingTrackedHabit;
            })
            .map(trackedHabitRepository::save);
    }

    // Example method in TrackedHabitService.java
    @Transactional(readOnly = true)
    public List<TrackedHabit> findAllWithEagerRelationships() {
        return trackedHabitRepository.findAllWithEagerRelationships();
    }

    @Transactional(readOnly = true)
    public Optional<TrackedHabit> findOneWithEagerRelationships(Long id) {
        return trackedHabitRepository.findOneWithEagerRelationships(id);
    }
}
