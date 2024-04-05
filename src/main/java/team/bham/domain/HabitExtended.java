package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A HabitExtended.
 */
@Entity
@Table(name = "habit_extended")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class HabitExtended implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "habit_extended_id")
    private Long habitExtendedID;

    @Column(name = "habit_extended_name")
    private String habitExtendedName;

    @Column(name = "habit_completion_checkbox")
    private Boolean habitCompletionCheckbox;

    @Column(name = "habit_date")
    private Instant habitDate;

    @ManyToOne
    @JsonIgnoreProperties(value = { "weeklySummary", "habit" }, allowSetters = true)
    private NewWeeklyHabitTracker rel1;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public HabitExtended id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getHabitExtendedID() {
        return this.habitExtendedID;
    }

    public HabitExtended habitExtendedID(Long habitExtendedID) {
        this.setHabitExtendedID(habitExtendedID);
        return this;
    }

    public void setHabitExtendedID(Long habitExtendedID) {
        this.habitExtendedID = habitExtendedID;
    }

    public String getHabitExtendedName() {
        return this.habitExtendedName;
    }

    public HabitExtended habitExtendedName(String habitExtendedName) {
        this.setHabitExtendedName(habitExtendedName);
        return this;
    }

    public void setHabitExtendedName(String habitExtendedName) {
        this.habitExtendedName = habitExtendedName;
    }

    public Boolean getHabitCompletionCheckbox() {
        return this.habitCompletionCheckbox;
    }

    public HabitExtended habitCompletionCheckbox(Boolean habitCompletionCheckbox) {
        this.setHabitCompletionCheckbox(habitCompletionCheckbox);
        return this;
    }

    public void setHabitCompletionCheckbox(Boolean habitCompletionCheckbox) {
        this.habitCompletionCheckbox = habitCompletionCheckbox;
    }

    public Instant getHabitDate() {
        return this.habitDate;
    }

    public HabitExtended habitDate(Instant habitDate) {
        this.setHabitDate(habitDate);
        return this;
    }

    public void setHabitDate(Instant habitDate) {
        this.habitDate = habitDate;
    }

    public NewWeeklyHabitTracker getRel1() {
        return this.rel1;
    }

    public void setRel1(NewWeeklyHabitTracker newWeeklyHabitTracker) {
        this.rel1 = newWeeklyHabitTracker;
    }

    public HabitExtended rel1(NewWeeklyHabitTracker newWeeklyHabitTracker) {
        this.setRel1(newWeeklyHabitTracker);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof HabitExtended)) {
            return false;
        }
        return id != null && id.equals(((HabitExtended) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "HabitExtended{" +
            "id=" + getId() +
            ", habitExtendedID=" + getHabitExtendedID() +
            ", habitExtendedName='" + getHabitExtendedName() + "'" +
            ", habitCompletionCheckbox='" + getHabitCompletionCheckbox() + "'" +
            ", habitDate='" + getHabitDate() + "'" +
            "}";
    }
}
