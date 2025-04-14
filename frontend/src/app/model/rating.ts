export type Rating = {
  id?: string;
  owner?: {
    id: string;
    email: string;
    displayName: string;
  };
  rit?: {
    id?: string|undefined;
  };
  value?: number;
  positiveComment?: string;
  negativeComment?: string;
  createdAt?: string;
  updatedAt?: string
}
