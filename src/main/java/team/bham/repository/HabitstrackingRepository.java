package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Habitstracking;

/**
 * Spring Data JPA repository for the Habitstracking entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HabitstrackingRepository extends JpaRepository<Habitstracking, Long> {}
