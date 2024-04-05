package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.HabitExtended;

/**
 * Spring Data JPA repository for the HabitExtended entity.
 */
@Repository
public interface HabitExtendedRepository extends JpaRepository<HabitExtended, Long> {
    default Optional<HabitExtended> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<HabitExtended> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<HabitExtended> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct habitExtended from HabitExtended habitExtended left join fetch habitExtended.rel1",
        countQuery = "select count(distinct habitExtended) from HabitExtended habitExtended"
    )
    Page<HabitExtended> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct habitExtended from HabitExtended habitExtended left join fetch habitExtended.rel1")
    List<HabitExtended> findAllWithToOneRelationships();

    @Query("select habitExtended from HabitExtended habitExtended left join fetch habitExtended.rel1 where habitExtended.id =:id")
    Optional<HabitExtended> findOneWithToOneRelationships(@Param("id") Long id);
}
