"use client";

import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { getHome } from "./lib/contentstack";
import { HomePage, Post } from "./types";

export default function Home() {
  const [home, setHome] = useState<HomePage>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHome().then((data) => {
      setHome(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-8 text-lg">Cargando Home…</div>;
  }

  if (!home) {
    return <div className="p-8 text-red-500">No se encontró la Home Page</div>;
  }

  console.log(home.featured_post);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-6 py-12 sm:px-8 sm:py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            {home.title}
          </h1>
          {home.description && (
            <div className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed prose prose-lg">
              {parse(home.description)}
            </div>
          )}
        </header>

        {home.featured_post && home.featured_post.length > 0 && (
          <section>
            <div className="flex items-center justify-center mb-12">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
              <h2 className="text-3xl font-bold text-gray-800 px-8">
                My posts
              </h2>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {home.featured_post.map((post: Post) => (
                <a
                  key={post.uid}
                  href={`/post/${post.slug || post.uid}`}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100 block"
                >
                  {post.featured_image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.featured_image.url}
                        alt={post.featured_image.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                      {post.title}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {post.author.profile_picture && (
                          <img
                            src={post.author.profile_picture.url}
                            alt={post.author.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <span className="text-sm font-medium text-gray-700">
                          {post.author.name}
                        </span>
                      </div>

                      <time className="text-sm text-gray-500">
                        {new Date(post.publish_date).toLocaleDateString(
                          "es-ES",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </time>
                    </div>

                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
