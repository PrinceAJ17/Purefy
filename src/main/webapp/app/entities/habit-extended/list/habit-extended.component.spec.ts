import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { HabitExtendedService } from '../service/habit-extended.service';

import { HabitExtendedComponent } from './habit-extended.component';

describe('HabitExtended Management Component', () => {
  let comp: HabitExtendedComponent;
  let fixture: ComponentFixture<HabitExtendedComponent>;
  let service: HabitExtendedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'habit-extended', component: HabitExtendedComponent }]), HttpClientTestingModule],
      declarations: [HabitExtendedComponent],
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
      .overrideTemplate(HabitExtendedComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HabitExtendedComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(HabitExtendedService);

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
    expect(comp.habitExtendeds?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to habitExtendedService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getHabitExtendedIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getHabitExtendedIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
