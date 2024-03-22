"use client";
import React, { useState, useEffect } from 'react';
import SectionContainer from '../components/SectionContainer'
import Header from '../components/Header';
import { useRouter } from "next/navigation";

const BlogPost = ({ date, title, tags, summary }) => (
  <div className="text-white py-6">
    <li className="py-5 border-b border-gray-700">
      <article className="px-6">
        <dd className="text-base font-medium leading-6 text-gray-400">
          <time dateTime={date}>{date}</time>
        </dd>
        <h2 className="text-2xl font-bold leading-8 tracking-tight my-2">
          <a href={`#${title}`} className="hover:text-gray-300">
            {title}
          </a>
        </h2>
        {tags && (
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="text-gray-400">
          {summary}
        </div>
      </article>
    </li>
  </div>
);

export default function BlogPage({ posts }) {
  const router = useRouter();
  const navigateToCreatePost = () => {
    router.push(`/create-post`);
  };
  const [blogPosts, setBlogPosts] = useState(posts || []);

  useEffect(() => {
        // Fetch blog posts from an API or define them here
        const posts = [
          { date: 'March 7, 2024', title: "Let's play", tags: ['4pm', 'Stamps Field', 'Soccer'], summary: 'Coming with 4 players, looking ofr at least 8 more, please bring dark and light shirts to make teams!' },
          { date: 'March 8, 2024', title: 'URGENT', tags: ['8pm', 'CRC 4th floor', 'BasketBall'], summary: 'Need at least 8 more to play full court, can play half court with at least 4 more!' }
          // ... more posts
        ];
        setBlogPosts(posts);
      }, []);

  return (
    <div className="bg-gray-950">
      <Header />
    <SectionContainer>
      <div className="min-h-screen">
        <h1 className="text-4xl font-bold text-white py-6 px-6">
          Notice Board
        </h1>
        <ul>
          {blogPosts.map((post, index) => (
            <BlogPost
              key={index}
              date={post.date}
              title={post.title}
              tags={post.tags}
              summary={post.summary}
            />
          ))}
        </ul>
      </div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 pb-8">
            <button
              onClick={(e) => {
                e.preventDefault();
                navigateToCreatePost();
              }}
              className="flex items-center justify-center p-0 w-16 h-16 bg-indigo-800 rounded-full hover:bg-indigo-700 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none"
            >
              <svg viewBox="0 0 24 24" className="w-10 h-10 text-indigo-100" fill="currentColor">
                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
              </svg>
            </button>
          </div>
      </SectionContainer>
    </div>
  );
}