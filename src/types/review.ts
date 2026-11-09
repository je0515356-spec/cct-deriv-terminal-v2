export interface PlatformReview {
  id: string;
  author: string;
  location?: string;
  market: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  date: string;
  verified: boolean;
}
