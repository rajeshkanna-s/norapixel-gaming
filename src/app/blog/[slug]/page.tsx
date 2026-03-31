"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { blogPosts } from "@/data/blog";
import { ArrowLeft } from "lucide-react";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="font-heading text-4xl text-neon-red mb-4">POST NOT FOUND</h1>
        <Link href="/blog" className="text-neon-cyan hover:underline">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto px-4 py-16"
    >
      <Link href="/blog" className="inline-flex items-center gap-2 text-text-secondary hover:text-neon-cyan mb-8 transition-colors font-body">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>

      <div className="mb-4 flex gap-2">
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-neon-cyan/10 text-neon-cyan">
          {post.category}
        </span>
        <span className="text-xs text-text-muted font-mono">{post.readTime} min read</span>
      </div>

      <h1 className="font-heading text-3xl md:text-4xl text-text-primary mb-4">{post.title}</h1>

      <div className="flex items-center gap-2 text-sm text-text-muted mb-8 font-body">
        <span>By {post.author}</span>
        <span>•</span>
        <span>{post.publishedAt}</span>
      </div>

      <div className="flex gap-2 mb-8">
        {post.tags.map((tag) => (
          <span key={tag} className="text-xs font-mono px-2 py-0.5 rounded bg-neon-purple/10 text-neon-purple">
            #{tag}
          </span>
        ))}
      </div>

      {/* Content */}
      <article className="prose prose-invert prose-cyan max-w-none font-body text-text-secondary leading-relaxed
        [&_h2]:font-heading [&_h2]:text-neon-cyan [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-4
        [&_p]:mb-4
        [&_strong]:text-text-primary
      ">
        {post.content.split("\n\n").map((para, i) => {
          if (para.startsWith("## ")) {
            return <h2 key={i}>{para.replace("## ", "")}</h2>;
          }
          return <p key={i}>{para}</p>;
        })}
      </article>
    </motion.div>
  );
}
