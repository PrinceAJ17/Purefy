import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TrackedHabitService } from '../service/tracked-habit.service';

import { TrackedHabitComponent } from './tracked-habit.component';

describe('TrackedHabit Management Component', () => {
  let comp: TrackedHabitComponent;
  let fixture: ComponentFixture<TrackedHabitComponent>;
  let service: TrackedHabitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'tracked-habit', component: TrackedHabitComponent }]), HttpClientTestingModule],
      declarations: [TrackedHabitComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(TrackedHabitComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TrackedHabitComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TrackedHabitService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.trackedHabits?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to trackedHabitService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getTrackedHabitIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getTrackedHabitIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
