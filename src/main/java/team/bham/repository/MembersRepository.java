package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Members;

/**
 * Spring Data JPA repository for the Members entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MembersRepository extends JpaRepository<Members, Long> {}
