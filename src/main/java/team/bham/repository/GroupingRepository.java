package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import team.bham.domain.Grouping;
import team.bham.service.dto.GroupDTO;
import java.util.List;


/**
 * Spring Data JPA repository for the Grouping entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GroupingRepository extends JpaRepository<Grouping, Long> {



}
