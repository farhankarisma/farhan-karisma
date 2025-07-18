import React from "react";
import Image from "next/image";
import Link from "next/link";

interface PostCardProps {
  id: string;
  title: string;
  publishedAt: string;
  imageUrl?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  publishedAt,
  imageUrl,
}) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <Link href={`/post/${id}`} className="block h-full">
        <header className="relative">
          <figure className="aspect-[4/3] overflow-hidden">
            <Image
              src={imageUrl || "/banner-stock.jpg"}
              alt={title}
              fill
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // @ts-ignore
                e.target.src = "/banner-stock.jpg";
              }}
            />
          </figure>
        </header>

        <div className="p-4 space-y-2">
          <time className="text-sm text-gray-500" dateTime={publishedAt}>
            {new Date(publishedAt).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>

          <h2 className="text-lg font-semibold text-gray-900 leading-tight line-clamp-3 hover:text-[#FF6600] transition-colors duration-200">
            {title}
          </h2>
        </div>
      </Link>
    </article>
  );
};

export default PostCard;
