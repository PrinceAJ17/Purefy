jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { TrackedHabitService } from '../service/tracked-habit.service';

import { TrackedHabitDeleteDialogComponent } from './tracked-habit-delete-dialog.component';

describe('TrackedHabit Management Delete Component', () => {
  let comp: TrackedHabitDeleteDialogComponent;
  let fixture: ComponentFixture<TrackedHabitDeleteDialogComponent>;
  let service: TrackedHabitService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TrackedHabitDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(TrackedHabitDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TrackedHabitDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TrackedHabitService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
