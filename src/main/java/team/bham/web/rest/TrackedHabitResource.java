package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.TrackedHabit;
import team.bham.repository.TrackedHabitRepository;
import team.bham.service.TrackedHabitService;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.TrackedHabit}.
 */
@RestController
@RequestMapping("/api")
public class TrackedHabitResource {

    private final Logger log = LoggerFactory.getLogger(TrackedHabitResource.class);

    private static final String ENTITY_NAME = "trackedHabit";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TrackedHabitService trackedHabitService;

    private final TrackedHabitRepository trackedHabitRepository;

    public TrackedHabitResource(TrackedHabitService trackedHabitService, TrackedHabitRepository trackedHabitRepository) {
        this.trackedHabitService = trackedHabitService;
        this.trackedHabitRepository = trackedHabitRepository;
    }

    /**
     * {@code POST  /tracked-habits} : Create a new trackedHabit.
     *
     * @param trackedHabit the trackedHabit to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new trackedHabit, or with status {@code 400 (Bad Request)} if the trackedHabit has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tracked-habits")
    public ResponseEntity<TrackedHabit> createTrackedHabit(@RequestBody TrackedHabit trackedHabit) throws URISyntaxException {
        log.debug("REST request to save TrackedHabit : {}", trackedHabit);
        if (trackedHabit.getId() != null) {
            throw new BadRequestAlertException("A new trackedHabit cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TrackedHabit result = trackedHabitService.save(trackedHabit);
        return ResponseEntity
            .created(new URI("/api/tracked-habits/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /tracked-habits/:id} : Updates an existing trackedHabit.
     *
     * @param id the id of the trackedHabit to save.
     * @param trackedHabit the trackedHabit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated trackedHabit,
     * or with status {@code 400 (Bad Request)} if the trackedHabit is not valid,
     * or with status {@code 500 (Internal Server Error)} if the trackedHabit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/tracked-habits/{id}")
    public ResponseEntity<TrackedHabit> updateTrackedHabit(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TrackedHabit trackedHabit
    ) throws URISyntaxException {
        log.debug("REST request to update TrackedHabit : {}, {}", id, trackedHabit);
        if (trackedHabit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, trackedHabit.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!trackedHabitRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TrackedHabit result = trackedHabitService.update(trackedHabit);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, trackedHabit.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /tracked-habits/:id} : Partial updates given fields of an existing trackedHabit, field will ignore if it is null
     *
     * @param id the id of the trackedHabit to save.
     * @param trackedHabit the trackedHabit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated trackedHabit,
     * or with status {@code 400 (Bad Request)} if the trackedHabit is not valid,
     * or with status {@code 404 (Not Found)} if the trackedHabit is not found,
     * or with status {@code 500 (Internal Server Error)} if the trackedHabit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/tracked-habits/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TrackedHabit> partialUpdateTrackedHabit(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TrackedHabit trackedHabit
    ) throws URISyntaxException {
        log.debug("REST request to partial update TrackedHabit partially : {}, {}", id, trackedHabit);
        if (trackedHabit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, trackedHabit.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!trackedHabitRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TrackedHabit> result = trackedHabitService.partialUpdate(trackedHabit);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, trackedHabit.getId().toString())
        );
    }

    /**
     * {@code GET  /tracked-habits} : get all the trackedHabits.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of trackedHabits in body.
     */
    @GetMapping("/tracked-habits")
    public List<TrackedHabit> getAllTrackedHabits(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all TrackedHabits");
        return trackedHabitService.findAll();
    }

    /**
     * {@code GET  /tracked-habits/:id} : get the "id" trackedHabit.
     *
     * @param id the id of the trackedHabit to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the trackedHabit, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tracked-habits/{id}")
    public ResponseEntity<TrackedHabit> getTrackedHabit(@PathVariable Long id) {
        log.debug("REST request to get TrackedHabit : {}", id);
        Optional<TrackedHabit> trackedHabit = trackedHabitService.findOne(id);
        return ResponseUtil.wrapOrNotFound(trackedHabit);
    }

    /**
     * {@code DELETE  /tracked-habits/:id} : delete the "id" trackedHabit.
     *
     * @param id the id of the trackedHabit to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tracked-habits/{id}")
    public ResponseEntity<Void> deleteTrackedHabit(@PathVariable Long id) {
        log.debug("REST request to delete TrackedHabit : {}", id);
        trackedHabitService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
