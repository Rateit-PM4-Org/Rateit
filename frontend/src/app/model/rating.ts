import {Rit} from './rit';

export type Rating = {
  id?: string;
  rit?: Rit;
  owner?: {
    id: string;
    email: string;
    displayName: string;
  };
  value?: number;
  positiveComment?: string;
  negativeComment?: string;
  createdAt?: string;
  updatedAt?: string
}
