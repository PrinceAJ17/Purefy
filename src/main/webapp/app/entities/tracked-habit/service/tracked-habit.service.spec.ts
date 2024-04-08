import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITrackedHabit } from '../tracked-habit.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../tracked-habit.test-samples';

import { TrackedHabitService } from './tracked-habit.service';

const requireRestSample: ITrackedHabit = {
  ...sampleWithRequiredData,
};

describe('TrackedHabit Service', () => {
  let service: TrackedHabitService;
  let httpMock: HttpTestingController;
  let expectedResult: ITrackedHabit | ITrackedHabit[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TrackedHabitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a TrackedHabit', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const trackedHabit = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(trackedHabit).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TrackedHabit', () => {
      const trackedHabit = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(trackedHabit).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TrackedHabit', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TrackedHabit', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TrackedHabit', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTrackedHabitToCollectionIfMissing', () => {
      it('should add a TrackedHabit to an empty array', () => {
        const trackedHabit: ITrackedHabit = sampleWithRequiredData;
        expectedResult = service.addTrackedHabitToCollectionIfMissing([], trackedHabit);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(trackedHabit);
      });

      it('should not add a TrackedHabit to an array that contains it', () => {
        const trackedHabit: ITrackedHabit = sampleWithRequiredData;
        const trackedHabitCollection: ITrackedHabit[] = [
          {
            ...trackedHabit,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTrackedHabitToCollectionIfMissing(trackedHabitCollection, trackedHabit);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TrackedHabit to an array that doesn't contain it", () => {
        const trackedHabit: ITrackedHabit = sampleWithRequiredData;
        const trackedHabitCollection: ITrackedHabit[] = [sampleWithPartialData];
        expectedResult = service.addTrackedHabitToCollectionIfMissing(trackedHabitCollection, trackedHabit);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(trackedHabit);
      });

      it('should add only unique TrackedHabit to an array', () => {
        const trackedHabitArray: ITrackedHabit[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const trackedHabitCollection: ITrackedHabit[] = [sampleWithRequiredData];
        expectedResult = service.addTrackedHabitToCollectionIfMissing(trackedHabitCollection, ...trackedHabitArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const trackedHabit: ITrackedHabit = sampleWithRequiredData;
        const trackedHabit2: ITrackedHabit = sampleWithPartialData;
        expectedResult = service.addTrackedHabitToCollectionIfMissing([], trackedHabit, trackedHabit2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(trackedHabit);
        expect(expectedResult).toContain(trackedHabit2);
      });

      it('should accept null and undefined values', () => {
        const trackedHabit: ITrackedHabit = sampleWithRequiredData;
        expectedResult = service.addTrackedHabitToCollectionIfMissing([], null, trackedHabit, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(trackedHabit);
      });

      it('should return initial array if no TrackedHabit is added', () => {
        const trackedHabitCollection: ITrackedHabit[] = [sampleWithRequiredData];
        expectedResult = service.addTrackedHabitToCollectionIfMissing(trackedHabitCollection, undefined, null);
        expect(expectedResult).toEqual(trackedHabitCollection);
      });
    });

    describe('compareTrackedHabit', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTrackedHabit(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTrackedHabit(entity1, entity2);
        const compareResult2 = service.compareTrackedHabit(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTrackedHabit(entity1, entity2);
        const compareResult2 = service.compareTrackedHabit(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTrackedHabit(entity1, entity2);
        const compareResult2 = service.compareTrackedHabit(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
