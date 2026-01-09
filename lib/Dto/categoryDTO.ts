export interface CategoryWithGamesDTO {
  id: string;
  name: string;
  description?: string | null;
  _count?: {
    games: number;
  };
  games?: Array<{
    id: string;
    name: string;
    image_url: string | null;
  }>;
}
