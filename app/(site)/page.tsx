import { Suspense } from "react";
import Banner from "@/components/Banner/Banner";
import PostsList from "@/components/Post/PostsList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Banner />
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
        <Suspense fallback={
          <div className="w-full h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#F27440]"></div>
          </div>
        }>
          <PostsList />
        </Suspense>
      </section>
    </main>
  );
}
