package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A TrackedHabit.
 */
@Entity
@Table(name = "tracked_habit")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TrackedHabit implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "completed")
    private Boolean completed;

    @Column(name = "tracked_habit_id")
    private Long trackedHabitID;

    @ManyToOne
    @JsonIgnoreProperties(value = { "newWeeklyHabitTrackers", "navigationPortal" }, allowSetters = true)
    private Habit rel1;

    @ManyToOne
    @JsonIgnoreProperties(value = { "weeklySummary", "habit" }, allowSetters = true)
    private NewWeeklyHabitTracker rel2;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TrackedHabit id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getCompleted() {
        return this.completed;
    }

    public TrackedHabit completed(Boolean completed) {
        this.setCompleted(completed);
        return this;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public Long getTrackedHabitID() {
        return this.trackedHabitID;
    }

    public TrackedHabit trackedHabitID(Long trackedHabitID) {
        this.setTrackedHabitID(trackedHabitID);
        return this;
    }

    public void setTrackedHabitID(Long trackedHabitID) {
        this.trackedHabitID = trackedHabitID;
    }

    public Habit getRel1() {
        return this.rel1;
    }

    public void setRel1(Habit habit) {
        this.rel1 = habit;
    }

    public TrackedHabit rel1(Habit habit) {
        this.setRel1(habit);
        return this;
    }

    public NewWeeklyHabitTracker getRel2() {
        return this.rel2;
    }

    public void setRel2(NewWeeklyHabitTracker newWeeklyHabitTracker) {
        this.rel2 = newWeeklyHabitTracker;
    }

    public TrackedHabit rel2(NewWeeklyHabitTracker newWeeklyHabitTracker) {
        this.setRel2(newWeeklyHabitTracker);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TrackedHabit)) {
            return false;
        }
        return id != null && id.equals(((TrackedHabit) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TrackedHabit{" +
            "id=" + getId() +
            ", completed='" + getCompleted() + "'" +
            ", trackedHabitID=" + getTrackedHabitID() +
            "}";
    }
}
