type SysFields = {
  uid: string;
  created_at?: string;
  updated_at?: string;
  locale?: string;
  publish_details?: unknown;
};

export type Author = {
  name: string;
  bio?: string;
  profile_picture?: { url: string; filename: string };
} & SysFields;

export type Post = {
  title: string;
  slug: string;
  excerpt?: string;
  body: any;
  featured_image?: { url: string; filename: string };
  content: any;
  author: Author;
  publish_date: string;
  tags?: string[];
} & SysFields;

export type HomePage = {
  title: string;
  description?: any;
  featured_post?: Post[];
} & SysFields;
