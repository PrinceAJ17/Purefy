package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.UserPoints;

/**
 * Spring Data JPA repository for the UserPoints entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserPointsRepository extends JpaRepository<UserPoints, Long> {}
