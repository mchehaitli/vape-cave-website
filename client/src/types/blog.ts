export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  displayOrder?: number;
  createdAt?: string;
}

export interface BlogPost {
  id: number;
  categoryId: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl?: string;
  published: boolean;
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  viewCount?: number;
  createdAt: string;
  updatedAt?: string;
}