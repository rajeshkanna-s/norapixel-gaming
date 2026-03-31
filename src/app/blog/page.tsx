"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import NeonCard from "@/components/ui/NeonCard";
import { blogPosts } from "@/data/blog";

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <SectionHeader icon="📝" title="BLOG" subtitle="Gaming tips, guides, and stories from the trenches" />

      <div className="grid md:grid-cols-2 gap-6">
        {blogPosts.map((post, i) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={`/blog/${post.slug}`}>
              <NeonCard className="h-full">
                {/* Cover gradient */}
                <div className={`h-40 bg-gradient-to-br ${
                  ["from-cyan-600 to-purple-600", "from-orange-500 to-pink-600", "from-green-500 to-cyan-500", "from-purple-600 to-red-500"][i % 4]
                } flex items-center justify-center`}>
                  <span className="text-5xl">{["🎮", "🖥️", "📺", "💰"][i % 4]}</span>
                </div>
                <div className="p-5">
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-neon-cyan/10 text-neon-cyan">
                      {post.category}
                    </span>
                    <span className="text-xs text-text-muted font-mono">{post.readTime} min read</span>
                  </div>
                  <h3 className="font-heading text-lg text-text-primary mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-text-secondary text-sm font-body line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-text-muted font-mono">{post.publishedAt}</span>
                    <span className="text-xs text-text-muted">•</span>
                    <span className="text-xs text-neon-purple font-body">{post.author}</span>
                  </div>
                </div>
              </NeonCard>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
