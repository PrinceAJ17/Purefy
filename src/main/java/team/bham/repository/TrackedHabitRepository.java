package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.TrackedHabit;

/**
 * Spring Data JPA repository for the TrackedHabit entity.
 */
@Repository
public interface TrackedHabitRepository extends JpaRepository<TrackedHabit, Long> {
    default Optional<TrackedHabit> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<TrackedHabit> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<TrackedHabit> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct trackedHabit from TrackedHabit trackedHabit left join fetch trackedHabit.rel1 left join fetch trackedHabit.rel2",
        countQuery = "select count(distinct trackedHabit) from TrackedHabit trackedHabit"
    )
    Page<TrackedHabit> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct trackedHabit from TrackedHabit trackedHabit left join fetch trackedHabit.rel1 left join fetch trackedHabit.rel2"
    )
    List<TrackedHabit> findAllWithToOneRelationships();

    @Query(
        "select trackedHabit from TrackedHabit trackedHabit left join fetch trackedHabit.rel1 left join fetch trackedHabit.rel2 where trackedHabit.id =:id"
    )
    Optional<TrackedHabit> findOneWithToOneRelationships(@Param("id") Long id);
}
