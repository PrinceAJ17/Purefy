package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class HabitExtendedTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(HabitExtended.class);
        HabitExtended habitExtended1 = new HabitExtended();
        habitExtended1.setId(1L);
        HabitExtended habitExtended2 = new HabitExtended();
        habitExtended2.setId(habitExtended1.getId());
        assertThat(habitExtended1).isEqualTo(habitExtended2);
        habitExtended2.setId(2L);
        assertThat(habitExtended1).isNotEqualTo(habitExtended2);
        habitExtended1.setId(null);
        assertThat(habitExtended1).isNotEqualTo(habitExtended2);
    }
}
