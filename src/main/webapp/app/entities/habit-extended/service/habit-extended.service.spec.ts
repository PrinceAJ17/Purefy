import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IHabitExtended } from '../habit-extended.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../habit-extended.test-samples';

import { HabitExtendedService, RestHabitExtended } from './habit-extended.service';

const requireRestSample: RestHabitExtended = {
  ...sampleWithRequiredData,
  habitDate: sampleWithRequiredData.habitDate?.toJSON(),
};

describe('HabitExtended Service', () => {
  let service: HabitExtendedService;
  let httpMock: HttpTestingController;
  let expectedResult: IHabitExtended | IHabitExtended[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(HabitExtendedService);
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

    it('should create a HabitExtended', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const habitExtended = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(habitExtended).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a HabitExtended', () => {
      const habitExtended = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(habitExtended).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a HabitExtended', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of HabitExtended', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a HabitExtended', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addHabitExtendedToCollectionIfMissing', () => {
      it('should add a HabitExtended to an empty array', () => {
        const habitExtended: IHabitExtended = sampleWithRequiredData;
        expectedResult = service.addHabitExtendedToCollectionIfMissing([], habitExtended);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(habitExtended);
      });

      it('should not add a HabitExtended to an array that contains it', () => {
        const habitExtended: IHabitExtended = sampleWithRequiredData;
        const habitExtendedCollection: IHabitExtended[] = [
          {
            ...habitExtended,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addHabitExtendedToCollectionIfMissing(habitExtendedCollection, habitExtended);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a HabitExtended to an array that doesn't contain it", () => {
        const habitExtended: IHabitExtended = sampleWithRequiredData;
        const habitExtendedCollection: IHabitExtended[] = [sampleWithPartialData];
        expectedResult = service.addHabitExtendedToCollectionIfMissing(habitExtendedCollection, habitExtended);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(habitExtended);
      });

      it('should add only unique HabitExtended to an array', () => {
        const habitExtendedArray: IHabitExtended[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const habitExtendedCollection: IHabitExtended[] = [sampleWithRequiredData];
        expectedResult = service.addHabitExtendedToCollectionIfMissing(habitExtendedCollection, ...habitExtendedArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const habitExtended: IHabitExtended = sampleWithRequiredData;
        const habitExtended2: IHabitExtended = sampleWithPartialData;
        expectedResult = service.addHabitExtendedToCollectionIfMissing([], habitExtended, habitExtended2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(habitExtended);
        expect(expectedResult).toContain(habitExtended2);
      });

      it('should accept null and undefined values', () => {
        const habitExtended: IHabitExtended = sampleWithRequiredData;
        expectedResult = service.addHabitExtendedToCollectionIfMissing([], null, habitExtended, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(habitExtended);
      });

      it('should return initial array if no HabitExtended is added', () => {
        const habitExtendedCollection: IHabitExtended[] = [sampleWithRequiredData];
        expectedResult = service.addHabitExtendedToCollectionIfMissing(habitExtendedCollection, undefined, null);
        expect(expectedResult).toEqual(habitExtendedCollection);
      });
    });

    describe('compareHabitExtended', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareHabitExtended(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareHabitExtended(entity1, entity2);
        const compareResult2 = service.compareHabitExtended(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareHabitExtended(entity1, entity2);
        const compareResult2 = service.compareHabitExtended(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareHabitExtended(entity1, entity2);
        const compareResult2 = service.compareHabitExtended(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
