package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import team.bham.IntegrationTest;
import team.bham.domain.HabitExtended;
import team.bham.repository.HabitExtendedRepository;

/**
 * Integration tests for the {@link HabitExtendedResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class HabitExtendedResourceIT {

    private static final Long DEFAULT_HABIT_EXTENDED_ID = 1L;
    private static final Long UPDATED_HABIT_EXTENDED_ID = 2L;

    private static final String DEFAULT_HABIT_EXTENDED_NAME = "AAAAAAAAAA";
    private static final String UPDATED_HABIT_EXTENDED_NAME = "BBBBBBBBBB";

    private static final Boolean DEFAULT_HABIT_COMPLETION_CHECKBOX = false;
    private static final Boolean UPDATED_HABIT_COMPLETION_CHECKBOX = true;

    private static final Instant DEFAULT_HABIT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_HABIT_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/habit-extendeds";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private HabitExtendedRepository habitExtendedRepository;

    @Mock
    private HabitExtendedRepository habitExtendedRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHabitExtendedMockMvc;

    private HabitExtended habitExtended;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HabitExtended createEntity(EntityManager em) {
        HabitExtended habitExtended = new HabitExtended()
            .habitExtendedID(DEFAULT_HABIT_EXTENDED_ID)
            .habitExtendedName(DEFAULT_HABIT_EXTENDED_NAME)
            .habitCompletionCheckbox(DEFAULT_HABIT_COMPLETION_CHECKBOX)
            .habitDate(DEFAULT_HABIT_DATE);
        return habitExtended;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HabitExtended createUpdatedEntity(EntityManager em) {
        HabitExtended habitExtended = new HabitExtended()
            .habitExtendedID(UPDATED_HABIT_EXTENDED_ID)
            .habitExtendedName(UPDATED_HABIT_EXTENDED_NAME)
            .habitCompletionCheckbox(UPDATED_HABIT_COMPLETION_CHECKBOX)
            .habitDate(UPDATED_HABIT_DATE);
        return habitExtended;
    }

    @BeforeEach
    public void initTest() {
        habitExtended = createEntity(em);
    }

    @Test
    @Transactional
    void createHabitExtended() throws Exception {
        int databaseSizeBeforeCreate = habitExtendedRepository.findAll().size();
        // Create the HabitExtended
        restHabitExtendedMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(habitExtended)))
            .andExpect(status().isCreated());

        // Validate the HabitExtended in the database
        List<HabitExtended> habitExtendedList = habitExtendedRepository.findAll();
        assertThat(habitExtendedList).hasSize(databaseSizeBeforeCreate + 1);
        HabitExtended testHabitExtended = habitExtendedList.get(habitExtendedList.size() - 1);
        assertThat(testHabitExtended.getHabitExtendedID()).isEqualTo(DEFAULT_HABIT_EXTENDED_ID);
        assertThat(testHabitExtended.getHabitExtendedName()).isEqualTo(DEFAULT_HABIT_EXTENDED_NAME);
        assertThat(testHabitExtended.getHabitCompletionCheckbox()).isEqualTo(DEFAULT_HABIT_COMPLETION_CHECKBOX);
        assertThat(testHabitExtended.getHabitDate()).isEqualTo(DEFAULT_HABIT_DATE);
    }

    @Test
    @Transactional
    void createHabitExtendedWithExistingId() throws Exception {
        // Create the HabitExtended with an existing ID
        habitExtended.setId(1L);

        int databaseSizeBeforeCreate = habitExtendedRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restHabitExtendedMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(habitExtended)))
            .andExpect(status().isBadRequest());

        // Validate the HabitExtended in the database
        List<HabitExtended> habitExtendedList = habitExtendedRepository.findAll();
        assertThat(habitExtendedList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllHabitExtendeds() throws Exception {
        // Initialize the database
        habitExtendedRepository.saveAndFlush(habitExtended);

        // Get all the habitExtendedList
        restHabitExtendedMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(habitExtended.getId().intValue())))
            .andExpect(jsonPath("$.[*].habitExtendedID").value(hasItem(DEFAULT_HABIT_EXTENDED_ID.intValue())))
            .andExpect(jsonPath("$.[*].habitExtendedName").value(hasItem(DEFAULT_HABIT_EXTENDED_NAME)))
            .andExpect(jsonPath("$.[*].habitCompletionCheckbox").value(hasItem(DEFAULT_HABIT_COMPLETION_CHECKBOX.booleanValue())))
            .andExpect(jsonPath("$.[*].habitDate").value(hasItem(DEFAULT_HABIT_DATE.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllHabitExtendedsWithEagerRelationshipsIsEnabled() throws Exception {
        when(habitExtendedRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restHabitExtendedMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(habitExtendedRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllHabitExtendedsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(habitExtendedRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restHabitExtendedMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(habitExtendedRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getHabitExtended() throws Exception {
        // Initialize the database
        habitExtendedRepository.saveAndFlush(habitExtended);

        // Get the habitExtended
        restHabitExtendedMockMvc
            .perform(get(ENTITY_API_URL_ID, habitExtended.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(habitExtended.getId().intValue()))
            .andExpect(jsonPath("$.habitExtendedID").value(DEFAULT_HABIT_EXTENDED_ID.intValue()))
            .andExpect(jsonPath("$.habitExtendedName").value(DEFAULT_HABIT_EXTENDED_NAME))
            .andExpect(jsonPath("$.habitCompletionCheckbox").value(DEFAULT_HABIT_COMPLETION_CHECKBOX.booleanValue()))
            .andExpect(jsonPath("$.habitDate").value(DEFAULT_HABIT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingHabitExtended() throws Exception {
        // Get the habitExtended
        restHabitExtendedMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingHabitExtended() throws Exception {
        // Initialize the database
        habitExtendedRepository.saveAndFlush(habitExtended);

        int databaseSizeBeforeUpdate = habitExtendedRepository.findAll().size();

        // Update the habitExtended
        HabitExtended updatedHabitExtended = habitExtendedRepository.findById(habitExtended.getId()).get();
        // Disconnect from session so that the updates on updatedHabitExtended are not directly saved in db
        em.detach(updatedHabitExtended);
        updatedHabitExtended
            .habitExtendedID(UPDATED_HABIT_EXTENDED_ID)
            .habitExtendedName(UPDATED_HABIT_EXTENDED_NAME)
            .habitCompletionCheckbox(UPDATED_HABIT_COMPLETION_CHECKBOX)
            .habitDate(UPDATED_HABIT_DATE);

        restHabitExtendedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedHabitExtended.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedHabitExtended))
            )
            .andExpect(status().isOk());

        // Validate the HabitExtended in the database
        List<HabitExtended> habitExtendedList = habitExtendedRepository.findAll();
        assertThat(habitExtendedList).hasSize(databaseSizeBeforeUpdate);
        HabitExtended testHabitExtended = habitExtendedList.get(habitExtendedList.size() - 1);
        assertThat(testHabitExtended.getHabitExtendedID()).isEqualTo(UPDATED_HABIT_EXTENDED_ID);
        assertThat(testHabitExtended.getHabitExtendedName()).isEqualTo(UPDATED_HABIT_EXTENDED_NAME);
        assertThat(testHabitExtended.getHabitCompletionCheckbox()).isEqualTo(UPDATED_HABIT_COMPLETION_CHECKBOX);
        assertThat(testHabitExtended.getHabitDate()).isEqualTo(UPDATED_HABIT_DATE);
    }

    @Test
    @Transactional
    void putNonExistingHabitExtended() throws Exception {
        int databaseSizeBeforeUpdate = habitExtendedRepository.findAll().size();
        habitExtended.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHabitExtendedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, habitExtended.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(habitExtended))
            )
            .andExpect(status().isBadRequest());

        // Validate the HabitExtended in the database
        List<HabitExtended> habitExtendedList = habitExtendedRepository.findAll();
        assertThat(habitExtendedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchHabitExtended() throws Exception {
        int databaseSizeBeforeUpdate = habitExtendedRepository.findAll().size();
        habitExtended.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHabitExtendedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(habitExtended))
            )
            .andExpect(status().isBadRequest());

        // Validate the HabitExtended in the database
        List<HabitExtended> habitExtendedList = habitExtendedRepository.findAll();
        assertThat(habitExtendedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamHabitExtended() throws Exception {
        int databaseSizeBeforeUpdate = habitExtendedRepository.findAll().size();
        habitExtended.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHabitExtendedMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(habitExtended)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the HabitExtended in the database
        List<HabitExtended> habitExtendedList = habitExtendedRepository.findAll();
        assertThat(habitExtendedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateHabitExtendedWithPatch() throws Exception {
        // Initialize the database
        habitExtendedRepository.saveAndFlush(habitExtended);

        int databaseSizeBeforeUpdate = habitExtendedRepository.findAll().size();

        // Update the habitExtended using partial update
        HabitExtended partialUpdatedHabitExtended = new HabitExtended();
        partialUpdatedHabitExtended.setId(habitExtended.getId());

        partialUpdatedHabitExtended
            .habitExtendedName(UPDATED_HABIT_EXTENDED_NAME)
            .habitCompletionCheckbox(UPDATED_HABIT_COMPLETION_CHECKBOX)
            .habitDate(UPDATED_HABIT_DATE);

        restHabitExtendedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHabitExtended.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHabitExtended))
            )
            .andExpect(status().isOk());

        // Validate the HabitExtended in the database
        List<HabitExtended> habitExtendedList = habitExtendedRepository.findAll();
        assertThat(habitExtendedList).hasSize(databaseSizeBeforeUpdate);
        HabitExtended testHabitExtended = habitExtendedList.get(habitExtendedList.size() - 1);
        assertThat(testHabitExtended.getHabitExtendedID()).isEqualTo(DEFAULT_HABIT_EXTENDED_ID);
        assertThat(testHabitExtended.getHabitExtendedName()).isEqualTo(UPDATED_HABIT_EXTENDED_NAME);
        assertThat(testHabitExtended.getHabitCompletionCheckbox()).isEqualTo(UPDATED_HABIT_COMPLETION_CHECKBOX);
        assertThat(testHabitExtended.getHabitDate()).isEqualTo(UPDATED_HABIT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateHabitExtendedWithPatch() throws Exception {
        // Initialize the database
        habitExtendedRepository.saveAndFlush(habitExtended);

        int databaseSizeBeforeUpdate = habitExtendedRepository.findAll().size();

        // Update the habitExtended using partial update
        HabitExtended partialUpdatedHabitExtended = new HabitExtended();
        partialUpdatedHabitExtended.setId(habitExtended.getId());

        partialUpdatedHabitExtended
            .habitExtendedID(UPDATED_HABIT_EXTENDED_ID)
            .habitExtendedName(UPDATED_HABIT_EXTENDED_NAME)
            .habitCompletionCheckbox(UPDATED_HABIT_COMPLETION_CHECKBOX)
            .habitDate(UPDATED_HABIT_DATE);

        restHabitExtendedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHabitExtended.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHabitExtended))
            )
            .andExpect(status().isOk());

        // Validate the HabitExtended in the database
        List<HabitExtended> habitExtendedList = habitExtendedRepository.findAll();
        assertThat(habitExtendedList).hasSize(databaseSizeBeforeUpdate);
        HabitExtended testHabitExtended = habitExtendedList.get(habitExtendedList.size() - 1);
        assertThat(testHabitExtended.getHabitExtendedID()).isEqualTo(UPDATED_HABIT_EXTENDED_ID);
        assertThat(testHabitExtended.getHabitExtendedName()).isEqualTo(UPDATED_HABIT_EXTENDED_NAME);
        assertThat(testHabitExtended.getHabitCompletionCheckbox()).isEqualTo(UPDATED_HABIT_COMPLETION_CHECKBOX);
        assertThat(testHabitExtended.getHabitDate()).isEqualTo(UPDATED_HABIT_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingHabitExtended() throws Exception {
        int databaseSizeBeforeUpdate = habitExtendedRepository.findAll().size();
        habitExtended.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHabitExtendedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, habitExtended.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(habitExtended))
            )
            .andExpect(status().isBadRequest());

        // Validate the HabitExtended in the database
        List<HabitExtended> habitExtendedList = habitExtendedRepository.findAll();
        assertThat(habitExtendedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchHabitExtended() throws Exception {
        int databaseSizeBeforeUpdate = habitExtendedRepository.findAll().size();
        habitExtended.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHabitExtendedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(habitExtended))
            )
            .andExpect(status().isBadRequest());

        // Validate the HabitExtended in the database
        List<HabitExtended> habitExtendedList = habitExtendedRepository.findAll();
        assertThat(habitExtendedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamHabitExtended() throws Exception {
        int databaseSizeBeforeUpdate = habitExtendedRepository.findAll().size();
        habitExtended.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHabitExtendedMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(habitExtended))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the HabitExtended in the database
        List<HabitExtended> habitExtendedList = habitExtendedRepository.findAll();
        assertThat(habitExtendedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteHabitExtended() throws Exception {
        // Initialize the database
        habitExtendedRepository.saveAndFlush(habitExtended);

        int databaseSizeBeforeDelete = habitExtendedRepository.findAll().size();

        // Delete the habitExtended
        restHabitExtendedMockMvc
            .perform(delete(ENTITY_API_URL_ID, habitExtended.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<HabitExtended> habitExtendedList = habitExtendedRepository.findAll();
        assertThat(habitExtendedList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
