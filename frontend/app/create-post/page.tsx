"use client"
import React, { useState } from 'react';
import SectionContainer from '../..//components/SectionContainer';
import Header from '../..//components/Header';
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxPeople, setMaxPeople] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [tags, setTags] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      user_id: userId,
      title: title,
      description: description,
      max_people: maxPeople,
      skill_level: skillLevel,
      tags: tags,
    };

    try {
      const response = await fetch('http://localhost:8000/v1/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      router.push('/postlist');
      const result = await response.json();
      console.log("Post created successfully:", result);
      alert("Post created successfully!");

      // Reset form
      setUserId("");
      setTitle("");
      setDescription("");
      setMaxPeople("");
      setSkillLevel("Undefined");
      setTags("");
    } catch (error) {
      console.error("Failed to create the post:", error);
      alert("Failed to create the post.");
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
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700">User ID</label>
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                required
              />
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                required
              />
            </div>
            <div>
          <label htmlFor="maxPeople" className="block text-sm font-medium text-gray-700">Max People</label>
          <input
            type="number"
            id="maxPeople"
            value={maxPeople}
            onChange={(e) => setMaxPeople(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
            required
          />
        </div>
        <div>
          <label htmlFor="skillLevel" className="block text-sm font-medium text-gray-700">Skill Level</label>
          <select
            id="skillLevel"
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
            required
          >
            <option value="Beginner">Beginner</option>
            <option value="Advanced">Advanced</option>
            <option value="Competent">Competent</option>
            <option value="Proficient">Proficient</option>
            <option value="Expert">Expert</option>
            <option value="Undefined">Undefined</option>
          </select>
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
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

