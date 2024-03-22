"use client"
import React, { useState } from 'react';
import SectionContainer from '../..//components/SectionContainer';
import Header from '../..//components/Header';

export default function CreatePostPage() {
  const [postDetails, setPostDetails] = useState({
    post_id: '',
    title: '',
    description: '',
    tags: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`api/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postDetails.post_id,
          title: postDetails.title,
          description: postDetails.description,
          tags: postDetails.tags
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Post created:', data);
    } catch (error) {
      console.error('Creating post failed:', error);
    }
  };
  return (
    <div className="bg-gray-950 min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow">
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-8">
            Create New Post
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
            <div>
              <label htmlFor="post_id" className="block text-sm font-medium text-gray-700">Post ID</label>
              <input
                id="post_id"
                name="post_id"
                type="text"
                required
                placeholder="Unique ID for the post"
                value={postDetails.post_id}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="Enter post title"
                value={postDetails.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                required
                placeholder="Write post description"
                value={postDetails.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                // rows="4"
              />
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
              <input
                id="tags"
                name="tags"
                type="text"
                placeholder="Tags"
                value={postDetails.tags}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Create Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
}
