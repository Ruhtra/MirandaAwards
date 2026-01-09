export interface GameWithCategoriesDTO {
  id: string;
  name: string;
  image_url?: string | null;
  description?: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  categories: CategoryDTO[];
}

export interface GameWithVotesAndCategoryDTO {
  id: string;
  name: string;
  image_url?: string | null;
  description?: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  categories: CategoryWithVoteDTO[];
}

export interface CategoryWithVoteDTO {
  id: string;
  name: string;
  description?: string | null;

  vote?: VoteDTO | null;
}

export interface CategoryDTO {
  id: string;
  name: string;
  description?: string | null;
}

export interface VoteDTO {
  id: string;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}
