import type { Category, Contribution } from '../types';
import type { DBSchema } from 'idb';

export interface InvestDB extends DBSchema {
  categories: {
    key: string;
    value: Category;
    indexes: { 'by-order': number };
  };
  contributions: {
    key: string;
    value: Contribution;
    indexes: { 'by-date': string };
  };
}
