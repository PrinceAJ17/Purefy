package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
import team.bham.domain.TrackedHabit;
import team.bham.repository.TrackedHabitRepository;
import team.bham.service.TrackedHabitService;

/**
 * Integration tests for the {@link TrackedHabitResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class TrackedHabitResourceIT {

    private static final Boolean DEFAULT_COMPLETED = false;
    private static final Boolean UPDATED_COMPLETED = true;

    private static final Long DEFAULT_TRACKED_HABIT_ID = 1L;
    private static final Long UPDATED_TRACKED_HABIT_ID = 2L;

    private static final String ENTITY_API_URL = "/api/tracked-habits";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TrackedHabitRepository trackedHabitRepository;

    @Mock
    private TrackedHabitRepository trackedHabitRepositoryMock;

    @Mock
    private TrackedHabitService trackedHabitServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTrackedHabitMockMvc;

    private TrackedHabit trackedHabit;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TrackedHabit createEntity(EntityManager em) {
        TrackedHabit trackedHabit = new TrackedHabit().completed(DEFAULT_COMPLETED).trackedHabitID(DEFAULT_TRACKED_HABIT_ID);
        return trackedHabit;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TrackedHabit createUpdatedEntity(EntityManager em) {
        TrackedHabit trackedHabit = new TrackedHabit().completed(UPDATED_COMPLETED).trackedHabitID(UPDATED_TRACKED_HABIT_ID);
        return trackedHabit;
    }

    @BeforeEach
    public void initTest() {
        trackedHabit = createEntity(em);
    }

    @Test
    @Transactional
    void createTrackedHabit() throws Exception {
        int databaseSizeBeforeCreate = trackedHabitRepository.findAll().size();
        // Create the TrackedHabit
        restTrackedHabitMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trackedHabit)))
            .andExpect(status().isCreated());

        // Validate the TrackedHabit in the database
        List<TrackedHabit> trackedHabitList = trackedHabitRepository.findAll();
        assertThat(trackedHabitList).hasSize(databaseSizeBeforeCreate + 1);
        TrackedHabit testTrackedHabit = trackedHabitList.get(trackedHabitList.size() - 1);
        assertThat(testTrackedHabit.getCompleted()).isEqualTo(DEFAULT_COMPLETED);
        assertThat(testTrackedHabit.getTrackedHabitID()).isEqualTo(DEFAULT_TRACKED_HABIT_ID);
    }

    @Test
    @Transactional
    void createTrackedHabitWithExistingId() throws Exception {
        // Create the TrackedHabit with an existing ID
        trackedHabit.setId(1L);

        int databaseSizeBeforeCreate = trackedHabitRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTrackedHabitMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trackedHabit)))
            .andExpect(status().isBadRequest());

        // Validate the TrackedHabit in the database
        List<TrackedHabit> trackedHabitList = trackedHabitRepository.findAll();
        assertThat(trackedHabitList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTrackedHabits() throws Exception {
        // Initialize the database
        trackedHabitRepository.saveAndFlush(trackedHabit);

        // Get all the trackedHabitList
        restTrackedHabitMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(trackedHabit.getId().intValue())))
            .andExpect(jsonPath("$.[*].completed").value(hasItem(DEFAULT_COMPLETED.booleanValue())))
            .andExpect(jsonPath("$.[*].trackedHabitID").value(hasItem(DEFAULT_TRACKED_HABIT_ID.intValue())));
    }

    @Test
    @Transactional
    void getAllTrackedHabitsWithEagerRelationships() throws Exception {
        // Initialize the database with one tracked habit
        trackedHabitRepository.saveAndFlush(trackedHabit);

        // Mock service to return the initialized tracked habit in a list
        when(trackedHabitServiceMock.findAllWithEagerRelationships()).thenReturn(List.of(trackedHabit));

        // Perform GET request
        restTrackedHabitMockMvc
            .perform(get(ENTITY_API_URL + "?eagerload=true"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.[*].id").value(hasItem(trackedHabit.getId().intValue())))
            .andExpect(jsonPath("$.[*].completed").value(hasItem(DEFAULT_COMPLETED.booleanValue())))
            .andExpect(jsonPath("$.[*].trackedHabitID").value(hasItem(DEFAULT_TRACKED_HABIT_ID.intValue())));

        // Verify the findAllWithEagerRelationships method was called
        verify(trackedHabitServiceMock, times(1)).findAllWithEagerRelationships();
    }

    @SuppressWarnings({ "unchecked" })
    @Test
    @Transactional
    void getAllTrackedHabitsWithEagerRelationshipsIsEnabled() throws Exception {
        when(trackedHabitServiceMock.findAllWithEagerRelationships()).thenReturn(new ArrayList<>());

        restTrackedHabitMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(trackedHabitServiceMock).findAllWithEagerRelationships();
    }

    @SuppressWarnings({ "unchecked" })
    @Test
    @Transactional
    void getAllTrackedHabitsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(trackedHabitServiceMock.findAllWithEagerRelationships()).thenReturn(new ArrayList<>());

        restTrackedHabitMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(trackedHabitRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getTrackedHabit() throws Exception {
        // Initialize the database
        trackedHabitRepository.saveAndFlush(trackedHabit);

        // Get the trackedHabit
        restTrackedHabitMockMvc
            .perform(get(ENTITY_API_URL_ID, trackedHabit.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(trackedHabit.getId().intValue()))
            .andExpect(jsonPath("$.completed").value(DEFAULT_COMPLETED.booleanValue()))
            .andExpect(jsonPath("$.trackedHabitID").value(DEFAULT_TRACKED_HABIT_ID.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingTrackedHabit() throws Exception {
        // Get the trackedHabit
        restTrackedHabitMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTrackedHabit() throws Exception {
        // Initialize the database
        trackedHabitRepository.saveAndFlush(trackedHabit);

        int databaseSizeBeforeUpdate = trackedHabitRepository.findAll().size();

        // Update the trackedHabit
        TrackedHabit updatedTrackedHabit = trackedHabitRepository.findById(trackedHabit.getId()).get();
        // Disconnect from session so that the updates on updatedTrackedHabit are not directly saved in db
        em.detach(updatedTrackedHabit);
        updatedTrackedHabit.completed(UPDATED_COMPLETED).trackedHabitID(UPDATED_TRACKED_HABIT_ID);

        restTrackedHabitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTrackedHabit.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTrackedHabit))
            )
            .andExpect(status().isOk());

        // Validate the TrackedHabit in the database
        List<TrackedHabit> trackedHabitList = trackedHabitRepository.findAll();
        assertThat(trackedHabitList).hasSize(databaseSizeBeforeUpdate);
        TrackedHabit testTrackedHabit = trackedHabitList.get(trackedHabitList.size() - 1);
        assertThat(testTrackedHabit.getCompleted()).isEqualTo(UPDATED_COMPLETED);
        assertThat(testTrackedHabit.getTrackedHabitID()).isEqualTo(UPDATED_TRACKED_HABIT_ID);
    }

    @Test
    @Transactional
    void putNonExistingTrackedHabit() throws Exception {
        int databaseSizeBeforeUpdate = trackedHabitRepository.findAll().size();
        trackedHabit.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTrackedHabitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, trackedHabit.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(trackedHabit))
            )
            .andExpect(status().isBadRequest());

        // Validate the TrackedHabit in the database
        List<TrackedHabit> trackedHabitList = trackedHabitRepository.findAll();
        assertThat(trackedHabitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTrackedHabit() throws Exception {
        int databaseSizeBeforeUpdate = trackedHabitRepository.findAll().size();
        trackedHabit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrackedHabitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(trackedHabit))
            )
            .andExpect(status().isBadRequest());

        // Validate the TrackedHabit in the database
        List<TrackedHabit> trackedHabitList = trackedHabitRepository.findAll();
        assertThat(trackedHabitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTrackedHabit() throws Exception {
        int databaseSizeBeforeUpdate = trackedHabitRepository.findAll().size();
        trackedHabit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrackedHabitMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trackedHabit)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TrackedHabit in the database
        List<TrackedHabit> trackedHabitList = trackedHabitRepository.findAll();
        assertThat(trackedHabitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTrackedHabitWithPatch() throws Exception {
        // Initialize the database
        trackedHabitRepository.saveAndFlush(trackedHabit);

        int databaseSizeBeforeUpdate = trackedHabitRepository.findAll().size();

        // Update the trackedHabit using partial update
        TrackedHabit partialUpdatedTrackedHabit = new TrackedHabit();
        partialUpdatedTrackedHabit.setId(trackedHabit.getId());

        partialUpdatedTrackedHabit.completed(UPDATED_COMPLETED).trackedHabitID(UPDATED_TRACKED_HABIT_ID);

        restTrackedHabitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTrackedHabit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTrackedHabit))
            )
            .andExpect(status().isOk());

        // Validate the TrackedHabit in the database
        List<TrackedHabit> trackedHabitList = trackedHabitRepository.findAll();
        assertThat(trackedHabitList).hasSize(databaseSizeBeforeUpdate);
        TrackedHabit testTrackedHabit = trackedHabitList.get(trackedHabitList.size() - 1);
        assertThat(testTrackedHabit.getCompleted()).isEqualTo(UPDATED_COMPLETED);
        assertThat(testTrackedHabit.getTrackedHabitID()).isEqualTo(UPDATED_TRACKED_HABIT_ID);
    }

    @Test
    @Transactional
    void fullUpdateTrackedHabitWithPatch() throws Exception {
        // Initialize the database
        trackedHabitRepository.saveAndFlush(trackedHabit);

        int databaseSizeBeforeUpdate = trackedHabitRepository.findAll().size();

        // Update the trackedHabit using partial update
        TrackedHabit partialUpdatedTrackedHabit = new TrackedHabit();
        partialUpdatedTrackedHabit.setId(trackedHabit.getId());

        partialUpdatedTrackedHabit.completed(UPDATED_COMPLETED).trackedHabitID(UPDATED_TRACKED_HABIT_ID);

        restTrackedHabitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTrackedHabit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTrackedHabit))
            )
            .andExpect(status().isOk());

        // Validate the TrackedHabit in the database
        List<TrackedHabit> trackedHabitList = trackedHabitRepository.findAll();
        assertThat(trackedHabitList).hasSize(databaseSizeBeforeUpdate);
        TrackedHabit testTrackedHabit = trackedHabitList.get(trackedHabitList.size() - 1);
        assertThat(testTrackedHabit.getCompleted()).isEqualTo(UPDATED_COMPLETED);
        assertThat(testTrackedHabit.getTrackedHabitID()).isEqualTo(UPDATED_TRACKED_HABIT_ID);
    }

    @Test
    @Transactional
    void patchNonExistingTrackedHabit() throws Exception {
        int databaseSizeBeforeUpdate = trackedHabitRepository.findAll().size();
        trackedHabit.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTrackedHabitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, trackedHabit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(trackedHabit))
            )
            .andExpect(status().isBadRequest());

        // Validate the TrackedHabit in the database
        List<TrackedHabit> trackedHabitList = trackedHabitRepository.findAll();
        assertThat(trackedHabitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTrackedHabit() throws Exception {
        int databaseSizeBeforeUpdate = trackedHabitRepository.findAll().size();
        trackedHabit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrackedHabitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(trackedHabit))
            )
            .andExpect(status().isBadRequest());

        // Validate the TrackedHabit in the database
        List<TrackedHabit> trackedHabitList = trackedHabitRepository.findAll();
        assertThat(trackedHabitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTrackedHabit() throws Exception {
        int databaseSizeBeforeUpdate = trackedHabitRepository.findAll().size();
        trackedHabit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrackedHabitMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(trackedHabit))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TrackedHabit in the database
        List<TrackedHabit> trackedHabitList = trackedHabitRepository.findAll();
        assertThat(trackedHabitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTrackedHabit() throws Exception {
        // Initialize the database
        trackedHabitRepository.saveAndFlush(trackedHabit);

        int databaseSizeBeforeDelete = trackedHabitRepository.findAll().size();

        // Delete the trackedHabit
        restTrackedHabitMockMvc
            .perform(delete(ENTITY_API_URL_ID, trackedHabit.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TrackedHabit> trackedHabitList = trackedHabitRepository.findAll();
        assertThat(trackedHabitList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
