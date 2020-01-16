export interface Tweet {
  source: string;
  text: string;
  createdAt: any;
  retweetCount: number;
  favoriteCount: number;
  polarity: number;
  id?: number;
}
