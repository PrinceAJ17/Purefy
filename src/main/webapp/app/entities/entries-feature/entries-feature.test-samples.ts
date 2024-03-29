import dayjs from 'dayjs/esm';

import { IEntriesFeature, NewEntriesFeature } from './entries-feature.model';

export const sampleWithRequiredData: IEntriesFeature = {
  id: 59371,
};

export const sampleWithPartialData: IEntriesFeature = {
  id: 58799,
  content: 'SSL revolutionize Programmable',
};

export const sampleWithFullData: IEntriesFeature = {
  id: 40265,
  title: 'Avon',
  content: 'hack',
  date: dayjs('2024-03-29'),
};

export const sampleWithNewData: NewEntriesFeature = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
