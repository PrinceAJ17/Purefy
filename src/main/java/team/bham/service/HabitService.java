package team.bham.service;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.Habit;
import team.bham.repository.HabitRepository;
import team.bham.web.rest.errors.BadRequestAlertException;

@Service
@Transactional
public class HabitService {

    private final Logger log = LoggerFactory.getLogger(HabitService.class);
    private final HabitRepository habitRepository;

    // No direct reference to TrackedHabitRepository or TrackedHabitService needed here

    public HabitService(HabitRepository habitRepository) {
        this.habitRepository = habitRepository;
    }

    public Habit createHabit(Habit habit) {
        if (habit.getId() != null) {
            throw new BadRequestAlertException("A new habit cannot already have an ID", "habit", "idexists");
        }
        log.debug("Request to save Habit : {}", habit);
        return habitRepository.save(habit);
    }

    public Habit updateHabit(Habit habit) {
        if (habit.getId() == null) {
            throw new BadRequestAlertException("Invalid ID", "habit", "idnull");
        }
        log.debug("Request to update Habit : {}", habit);
        return habitRepository.save(habit);
    }

    @Transactional(readOnly = true)
    public List<Habit> findAll() {
        log.debug("Request to get all Habits");
        return habitRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Habit> findOne(Long id) {
        log.debug("Request to get Habit : {}", id);
        return habitRepository.findById(id);
    }

    public void delete(Long id) {
        log.debug("Request to delete Habit : {}", id);
        habitRepository.deleteById(id);
    }
    // Method to interact with TrackedHabits might be added here if necessary
    // Example: Creating a new TrackedHabit for each Habit in a new WeeklyHabitTracker
    // This would be more of a business operation, potentially spanning multiple services
}
