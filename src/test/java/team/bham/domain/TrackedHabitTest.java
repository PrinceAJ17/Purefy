package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class TrackedHabitTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TrackedHabit.class);
        TrackedHabit trackedHabit1 = new TrackedHabit();
        trackedHabit1.setId(1L);
        TrackedHabit trackedHabit2 = new TrackedHabit();
        trackedHabit2.setId(trackedHabit1.getId());
        assertThat(trackedHabit1).isEqualTo(trackedHabit2);
        trackedHabit2.setId(2L);
        assertThat(trackedHabit1).isNotEqualTo(trackedHabit2);
        trackedHabit1.setId(null);
        assertThat(trackedHabit1).isNotEqualTo(trackedHabit2);
    }
}
