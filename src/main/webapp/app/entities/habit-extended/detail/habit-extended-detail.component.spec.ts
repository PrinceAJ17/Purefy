import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HabitExtendedDetailComponent } from './habit-extended-detail.component';

describe('HabitExtended Management Detail Component', () => {
  let comp: HabitExtendedDetailComponent;
  let fixture: ComponentFixture<HabitExtendedDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HabitExtendedDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ habitExtended: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(HabitExtendedDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(HabitExtendedDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load habitExtended on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.habitExtended).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
