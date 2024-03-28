"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SectionContainer from '../../components/SectionContainer';
import Header from '../../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams } from "next/navigation";

const PostListPage = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    console.log(id);

    useEffect(() => {
        setIsLoading(true);
        fetch(`http://localhost:8000/v1/posts`, { method: "GET", })
        .then((response) => response.json())
        .then((data) => {
            setPosts(data.posts);
            setIsLoading(false);
        })
        .catch((error) => {
            console.error('Error:', error);
            setIsLoading(false);
        });
    }, []);

    const viewPostDetails = (post_id) => {
        // setSelectedPostId(post_id);
        router.push(`/post?id=${id}&postId=${post_id}`);
    };

    const navigateToCreatePost = () => {
        router.push(`/create-post?id=${id}`);
    };

    const renderPostList = () => (
        <div className="bg-gray-950 text-white">
        <Header id={id} />
        <SectionContainer>
            <div className="min-h-screen">
            <h1 className="text-4xl font-bold py-6 px-6">Notice Board</h1>
            <ul>
                {posts.map((post, index) => (
                <li key={index} className="py-5 border-b border-gray-700">
                    <article className="px-6">
                    <dd className="text-base font-medium leading-6 text-gray-400">
                        <time dateTime={new Date(post.created_at * 1000).toISOString()}>
                        {new Date(post.created_at * 1000).toLocaleDateString("en-US", {
                            year: 'numeric', month: 'long', day: 'numeric',
                            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
                        })}
                        </time>
                    </dd>
                    <h2 className="text-2xl font-bold leading-8 tracking-tight my-2">
                        <a onClick={() => viewPostDetails(post.id)} className="hover:text-gray-300 cursor-pointer">
                        {post.title}
                        </a>
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        {post.tags.map((tag, index) => (
                            <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                {tag}
                            </span>
                        ))}
                        
                        <span className="ml-auto bg-gray-800 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                            Max People: {post.max_people}
                        </span>
                        <span className="bg-gray-800 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                            Skill Level: {post.skill_level}
                        </span>
                    </div>
                    <div className="text-gray-400">
                        {post.description}
                    </div>
                    </article>
                </li>
                ))}
            </ul>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 pb-8">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        navigateToCreatePost();
                    }}
                    className="flex items-center justify-center p-0 w-12 h-12 bg-indigo-800 rounded-full hover:bg-indigo-700 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none"
                >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-indigo-100" fill="currentColor">
                        <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                    </svg>
                </button>
            </div>
        </SectionContainer>
    </div>
);
    if (isLoading) return <div>Loading...</div>;
    return renderPostList();
};

export default PostListPage;