import Link from "next/link";
import { Post } from "../types";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="rounded-2xl border p-4 shadow-sm hover:shadow-md transition">
      {post.featured_image?.url && (
        <img
          src={post.featured_image.url}
          alt={post.title}
          className="mb-3 h-44 w-full rounded-xl object-cover"
        />
      )}
      <h3 className="mb-1 text-lg font-semibold">
        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
      </h3>
      <p className="mb-2 text-sm text-gray-500">
        {new Date(post.publish_date).toLocaleDateString()}
        {post.author?.name ? ` • ${post.author.name}` : ""}
      </p>
      <div className="mt-3">
        <Link
          href={`/posts/${post.slug}`}
          className="text-sm font-medium underline"
        >
          Leer más →
        </Link>
      </div>
    </article>
  );
}
