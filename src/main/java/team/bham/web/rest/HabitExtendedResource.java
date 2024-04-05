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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.HabitExtended;
import team.bham.repository.HabitExtendedRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.HabitExtended}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class HabitExtendedResource {

    private final Logger log = LoggerFactory.getLogger(HabitExtendedResource.class);

    private static final String ENTITY_NAME = "habitExtended";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HabitExtendedRepository habitExtendedRepository;

    public HabitExtendedResource(HabitExtendedRepository habitExtendedRepository) {
        this.habitExtendedRepository = habitExtendedRepository;
    }

    /**
     * {@code POST  /habit-extendeds} : Create a new habitExtended.
     *
     * @param habitExtended the habitExtended to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new habitExtended, or with status {@code 400 (Bad Request)} if the habitExtended has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/habit-extendeds")
    public ResponseEntity<HabitExtended> createHabitExtended(@RequestBody HabitExtended habitExtended) throws URISyntaxException {
        log.debug("REST request to save HabitExtended : {}", habitExtended);
        if (habitExtended.getId() != null) {
            throw new BadRequestAlertException("A new habitExtended cannot already have an ID", ENTITY_NAME, "idexists");
        }
        HabitExtended result = habitExtendedRepository.save(habitExtended);
        return ResponseEntity
            .created(new URI("/api/habit-extendeds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /habit-extendeds/:id} : Updates an existing habitExtended.
     *
     * @param id the id of the habitExtended to save.
     * @param habitExtended the habitExtended to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated habitExtended,
     * or with status {@code 400 (Bad Request)} if the habitExtended is not valid,
     * or with status {@code 500 (Internal Server Error)} if the habitExtended couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/habit-extendeds/{id}")
    public ResponseEntity<HabitExtended> updateHabitExtended(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody HabitExtended habitExtended
    ) throws URISyntaxException {
        log.debug("REST request to update HabitExtended : {}, {}", id, habitExtended);
        if (habitExtended.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, habitExtended.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!habitExtendedRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        HabitExtended result = habitExtendedRepository.save(habitExtended);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, habitExtended.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /habit-extendeds/:id} : Partial updates given fields of an existing habitExtended, field will ignore if it is null
     *
     * @param id the id of the habitExtended to save.
     * @param habitExtended the habitExtended to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated habitExtended,
     * or with status {@code 400 (Bad Request)} if the habitExtended is not valid,
     * or with status {@code 404 (Not Found)} if the habitExtended is not found,
     * or with status {@code 500 (Internal Server Error)} if the habitExtended couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/habit-extendeds/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<HabitExtended> partialUpdateHabitExtended(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody HabitExtended habitExtended
    ) throws URISyntaxException {
        log.debug("REST request to partial update HabitExtended partially : {}, {}", id, habitExtended);
        if (habitExtended.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, habitExtended.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!habitExtendedRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<HabitExtended> result = habitExtendedRepository
            .findById(habitExtended.getId())
            .map(existingHabitExtended -> {
                if (habitExtended.getHabitExtendedID() != null) {
                    existingHabitExtended.setHabitExtendedID(habitExtended.getHabitExtendedID());
                }
                if (habitExtended.getHabitExtendedName() != null) {
                    existingHabitExtended.setHabitExtendedName(habitExtended.getHabitExtendedName());
                }
                if (habitExtended.getHabitCompletionCheckbox() != null) {
                    existingHabitExtended.setHabitCompletionCheckbox(habitExtended.getHabitCompletionCheckbox());
                }
                if (habitExtended.getHabitDate() != null) {
                    existingHabitExtended.setHabitDate(habitExtended.getHabitDate());
                }

                return existingHabitExtended;
            })
            .map(habitExtendedRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, habitExtended.getId().toString())
        );
    }

    /**
     * {@code GET  /habit-extendeds} : get all the habitExtendeds.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of habitExtendeds in body.
     */
    @GetMapping("/habit-extendeds")
    public List<HabitExtended> getAllHabitExtendeds(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all HabitExtendeds");
        if (eagerload) {
            return habitExtendedRepository.findAllWithEagerRelationships();
        } else {
            return habitExtendedRepository.findAll();
        }
    }

    /**
     * {@code GET  /habit-extendeds/:id} : get the "id" habitExtended.
     *
     * @param id the id of the habitExtended to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the habitExtended, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/habit-extendeds/{id}")
    public ResponseEntity<HabitExtended> getHabitExtended(@PathVariable Long id) {
        log.debug("REST request to get HabitExtended : {}", id);
        Optional<HabitExtended> habitExtended = habitExtendedRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(habitExtended);
    }

    /**
     * {@code DELETE  /habit-extendeds/:id} : delete the "id" habitExtended.
     *
     * @param id the id of the habitExtended to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/habit-extendeds/{id}")
    public ResponseEntity<Void> deleteHabitExtended(@PathVariable Long id) {
        log.debug("REST request to delete HabitExtended : {}", id);
        habitExtendedRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
