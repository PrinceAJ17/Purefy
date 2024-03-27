package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import team.bham.domain.Members;
import team.bham.service.dto.PointsDTO;
import java.util.List;


/**
 * Spring Data JPA repository for the Members entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MembersRepository extends JpaRepository<Members, Long> {
    @Query("SELECT new team.bham.service.dto.PointsDTO(u.userName, up.currentPoints, up.previousPoints, up.totalPoints) " +
        "FROM Members m " +
        "JOIN UserDB u ON m.userID = u.id " +
        "JOIN UserPoints up ON u.id = up.userID " +
        "WHERE m.groupID = :groupId")
    List<PointsDTO> findPointsByGroupID(@Param("groupId") Long groupId);



}
