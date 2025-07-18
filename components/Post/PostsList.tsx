"use client";

import React, { useState, useEffect } from "react";
import PostCard from "./PostCard";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

interface Post {
  id: string;
  title: string;
  publishedAt: string;
  imageUrl?: string;
}

interface ImageData {
  url: string;
  width?: number;
  height?: number;
  mime?: string;
  size?: number;
}

interface ApiResponseItem {
  id: string;
  title: string;
  published_at: string;
  medium_image?: string | ImageData | ImageData[];
  small_image?: string | ImageData | ImageData[];
  image?: string | ImageData | ImageData[];
  featured_image?: string | ImageData | ImageData[];
  thumbnail?: string | ImageData | ImageData[];
  photo?: string | ImageData | ImageData[];
  picture?: string | ImageData | ImageData[];
}

interface ApiResponse {
  data: ApiResponseItem[];
  meta: {
    total: number;
    current_page: number;
    per_page: number;
    last_page: number;
  };
}

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50];

// Helper function to extract image URL from various formats
const extractImageUrl = (imageData: string | ImageData | ImageData[] | null): string | null => {
  if (!imageData) return null;
  
  // If it's an array, take the first item
  if (Array.isArray(imageData)) {
    if (imageData.length === 0) return null;
    return extractImageUrl(imageData[0]);
  }
  
  // If it's an object with url property
  if (typeof imageData === 'object' && imageData.url) {
    return imageData.url;
  }
  
  // If it's a string (direct URL)
  if (typeof imageData === 'string') {
    return imageData;
  }
  
  return null;
};

// Helper function to construct full image URL
const buildImageUrl = (imageUrl: string | null): string => {
  if (!imageUrl) return "/banner-stock.jpg";
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }
  
  // Try suitmedia.static-assets.id first
  if (imageUrl.startsWith("/")) {
    return `https://suitmedia.static-assets.id${imageUrl}`;
  }
  
  // Fallback to the original backend URL
  return `https://suitmedia-backend.suitdev.com${imageUrl}`;
};

// Main function to get image URL with fallback priority
type ItemWithImages = ApiResponseItem;

const getImageUrl = (item: ItemWithImages): string => {
  // Try medium_image first
  let imageUrl = extractImageUrl(item.medium_image || null);
  
  // If no medium_image, try small_image
  if (!imageUrl) {
    imageUrl = extractImageUrl(item.small_image || null);
  }

  // Try other possible image properties
  if (!imageUrl) {
    if (item.featured_image) imageUrl = extractImageUrl(item.featured_image || null);
    if (!imageUrl && item.image) imageUrl = extractImageUrl(item.image || null);
    if (!imageUrl && item.thumbnail) imageUrl = extractImageUrl(item.thumbnail || null);
    if (!imageUrl && item.photo) imageUrl = extractImageUrl(item.photo || null);
    if (!imageUrl && item.picture) imageUrl = extractImageUrl(item.picture || null);
  }

  return buildImageUrl(imageUrl);
};

export default function PostsList() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const page = Number(searchParams.get("page")) || 1;
  const perPage = Number(searchParams.get("per_page")) || 10;
  const sort = searchParams.get("sort") || "newest";

  // API state
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch posts from API
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("per_page", perPage.toString());
    params.set("sort", sort);

    fetch(`/api/ideas?${params.toString()}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: ApiResponse) => {
        console.log('Frontend received data:', data);
        setTotalPosts(data.meta?.total || 0);
        
        const mappedPosts = (data.data || []).map((item) => {
          const imageUrl = getImageUrl(item);
          
          console.log(`Post ${item.id} image processing:`, {
            medium_image: item.medium_image,
            small_image: item.small_image,
            medium_first: Array.isArray(item.medium_image) ? item.medium_image[0] : item.medium_image,
            small_first: Array.isArray(item.small_image) ? item.small_image[0] : item.small_image,
            extracted_medium: extractImageUrl(item.medium_image || null),
            extracted_small: extractImageUrl(item.small_image || null),
            final_url: imageUrl
          });
          
          return {
            id: item.id,
            title: item.title,
            publishedAt: item.published_at,
            imageUrl: imageUrl,
          };
        });
        
        setPosts(mappedPosts);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, [page, perPage, sort]);

  // Update URL params
  const handleParamChange = (param: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(param, value);
    if (param !== "page") params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
  };

  const totalPages = Math.ceil(totalPosts / perPage);

  return (
    <div>
      {/* Controls */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-sm text-gray-600 font-semibold">
          Showing {posts.length ? (page - 1) * perPage + 1 : 0} -{" "}
          {posts.length ? (page - 1) * perPage + posts.length : 0} of{" "}
          {totalPosts}
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-semibold">
              Show per page:
            </span>
            <select
              value={perPage}
              onChange={(e) => handleParamChange("per_page", e.target.value)}
              className="border rounded-4xl p-1 bg-white text-sm min-w-[70px]"
            >
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-semibold">
              Sort by:
            </span>
            <select
              value={sort}
              onChange={(e) => handleParamChange("sort", e.target.value)}
              className="border rounded-4xl p-1 bg-white text-sm min-w-[100px]"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </div>
      {/* Posts Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              publishedAt={post.publishedAt}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
      )}
      {/* Pagination */}
      <div className="mt-8 flex justify-center items-center gap-1">
        {/* First and Previous */}
        <button
          onClick={() => handleParamChange("page", "1")}
          disabled={page === 1}
          className="px-2 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          «
        </button>
        <button
          onClick={() => handleParamChange("page", (page - 1).toString())}
          disabled={page === 1}
          className="px-2 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ‹
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((num) => {
            if (totalPages <= 7) return true;
            if (num === 1) return true;
            if (num === totalPages) return true;
            if (num >= page - 2 && num <= page + 2) return true;
            return false;
          })
          .map((pageNum, index, array) => {
            if (index > 0 && pageNum - array[index - 1] > 1) {
              return [
                <span key={`ellipsis-${pageNum}`} className="px-2">
                  ...
                </span>,
                <button
                  key={pageNum}
                  onClick={() => handleParamChange("page", pageNum.toString())}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${
                    pageNum === page ? "text-white" : " hover:text-gray-500"
                  }`}
                >
                  {pageNum}
                </button>,
              ];
            }
            return (
              <button
                key={pageNum}
                onClick={() => handleParamChange("page", pageNum.toString())}
                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                  pageNum === page
                    ? "text-black"
                    : "bg-white text-black/60 hover:bg-gray-100"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

        {/* Next and Last */}
        <button
          onClick={() => handleParamChange("page", (page + 1).toString())}
          disabled={page === totalPages}
          className="px-2 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ›
        </button>
        <button
          onClick={() => handleParamChange("page", totalPages.toString())}
          disabled={page === totalPages}
          className="px-2 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          »
        </button>
      </div>
    </div>
  );
}