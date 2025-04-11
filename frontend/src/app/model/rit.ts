export type Rit = {
    id?: string;
    name?: string;
    details?: string;
    tags: string[];
    owner?: {
      id: string;
      email: string;
      displayName: string;
    };
    published?: boolean;
    createdAt?: string;
    updatedAt?: string;
    lastInteractionAt?: string;
  };
  