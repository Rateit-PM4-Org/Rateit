import { Rating } from "./rating";

export type Rit = {
    id?: string;
    name?: string;
    details?: string;
    tags: string[];
    ratings?: Rating[];
    owner?: {
      id: string;
      email: string;
      displayName: string;
    };
    published?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
  