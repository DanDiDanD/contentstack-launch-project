"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPost } from "../../lib/contentstack";
import { Post } from "../../types";

import parse from "html-react-parser";

export default function PostPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      getPost(params.slug as string)
        .then((data) => {
          setPost(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [params.slug]);

  if (loading) {
    return <div className="p-8 text-lg">Cargando post...</div>;
  }

  if (!post) {
    return <div className="p-8 text-red-500">Post no encontrado</div>;
  }

  console.log(post.content);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  {post.author.profile_picture && (
                    <img
                      src={post.author.profile_picture.url}
                      alt={post.author.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <span className="font-medium text-gray-900">
                      {post.author.name}
                    </span>
                    <time className="block text-sm text-gray-500">
                      {new Date(post.publish_date).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                </div>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {parse(post.content)}
          </div>
        </article>
      </div>
    </main>
  );
}
