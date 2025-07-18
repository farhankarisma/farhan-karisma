"use client";

import Banner from "@/components/Banner/Banner";
import PostsList from "@/components/Post/PostsList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Banner />
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
        <PostsList />
      </section>
    </main>
  );
}
