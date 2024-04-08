package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Grouping;

/**
 * Spring Data JPA repository for the Grouping entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GroupingRepository extends JpaRepository<Grouping, Long> {}
