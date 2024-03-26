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
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPostDetails, setSelectedPostDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const router = useRouter();
  const [comment, setComment] = useState('');
const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
const searchParams = useSearchParams();

  const userId = searchParams.get("id");


const submitComment = async () => {
    setIsCommentSubmitting(true);
  
    try {
      const response = await fetch('http://localhost:8000/v1/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId, 
          post_id: selectedPostId,
          data: comment,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit comment.');
      }
  
      // Consider clearing the comment input and refreshing the post's comments here
      setComment('');
      // Fetch the post details again to refresh comments, or append the new comment to the state
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsCommentSubmitting(false);
    }
  };
  

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

  useEffect(() => {
    if (selectedPostId) {
      setIsLoadingDetails(true);
      fetch(`http://localhost:8000/v1/post/${selectedPostId}`, { method: "GET", })
        .then((response) => response.json())
        .then((data) => {
          setSelectedPostDetails(data.post);
          setIsLoadingDetails(false);
        })
        .catch((error) => {
          console.error('Error fetching post details:', error);
          setIsLoadingDetails(false);
        });
    }
  }, [selectedPostId]);

  const viewPostDetails = (post_id) => {
    setSelectedPostId(post_id);
    // router.push('individual-post');
  };

  const navigateToCreatePost = () => {
    router.push('create-post'); // Adjust the path as needed
    };

  const renderPostList = () => (
    <div className="bg-gray-950 text-white">
      <Header />
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

  const renderPostDetails = () => {
    if (isLoadingDetails) return <p>Loading post details...</p>;
    if (!selectedPostDetails) return <p>Post details not found.</p>;

    const renderComments = (comments) => {
        return comments.map((comment, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg my-2">
            <div className="flex items-center text-sm mb-2">
              <svg className="h-4 w-4 text-gray-300 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 13c0 1.05-.815 1.918-1.858 1.995l-1.574.142-.223.812a8 8 0 01-7.345 5.35A7.968 7.968 0 014 18H3.5H3a.5.5 0 01-.09-.992L3 17h1a6.97 6.97 0 004.33-1.938A7.968 7.968 0 0013 10V9.5V9a.5.5 0 01.992-.09L14 9v1c0 1.591.642 3.117 1.767 4.233A5.97 5.97 0 0020 13v1a.5.5 0 01-.992.09L19 14v-1zM3.5 3a.5.5 0 01.492.41L4 3.5V4c0 1.971.75 3.887 2.05 5.33.011.012.022.024.034.035a.5.5 0 01-.067.707A.5.5 0 016 10a.5.5 0 01-.224-.053 6.979 6.979 0 01-1.72-1.593A6.978 6.978 0 013 4v-.5V3a.5.5 0 01.5-.5zM2 6a2 2 0 113.999-.001A2 2 0 012 6z" clipRule="evenodd" />
              </svg>
              {comment.user_id}
            </div>
            <div className="text-gray-300 text-sm">
              {comment.data}
            </div>
            <div className="text-gray-500 text-xs mt-2">
              {new Date(comment.created_at * 1000).toLocaleString()}
            </div>
          </div>
        ));
      };

    return (
        <div className="min-h-screen bg-gray-950 text-white">
          <Header />
          <SectionContainer>
          <div className="max-w-xl mx-auto my-6 p-6 rounded-lg bg-gray-900 shadow-lg">
        <div className="flex items-center text-sm font-medium mb-1">
          <svg className="h-4 w-4 text-gray-100 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M5.121 17.121a1.5 1.5 0 00-2.121 2.122c1.378 1.378 3.5 2.364 5.974 2.745 1.062.164 2.162.164 3.225 0 2.473-.381 4.596-1.367 5.974-2.745a1.5 1.5 0 00-2.121-2.122 7.97 7.97 0 01-3.853 1.087 7.97 7.97 0 01-3.853-1.087z"></path>
            <path d="M12 1C8.318 1 5.5 4.036 5.5 7.95c0 2.344 1.312 4.424 3.257 5.65a8.049 8.049 0 007.486 0A6.95 6.95 0 0018.5 7.95C18.5 4.036 15.682 1 12 1z"></path>
          </svg>
          {selectedPostDetails.user_id} · {new Date(selectedPostDetails.created_at * 1000).toLocaleString()}
        </div>
              <h1 className="text-3xl font-bold mb-4">{selectedPostDetails.title}</h1>
              
              <div className="flex flex-wrap items-center gap-2 mb-4">
                    {selectedPostDetails.tags.map((tag, index) => (
                        <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {tag}
                        </span>
                    ))}
                    
                    <span className="ml-auto bg-gray-800 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                        Max People: {selectedPostDetails.max_people}
                    </span>
                    <span className="bg-gray-800 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                        Skill Level: {selectedPostDetails.skill_level}
                    </span>
                </div>
              
              <p className="mt-4"><strong></strong> {selectedPostDetails.description}</p>
              {/* <p className="mt-2"><strong>Posted On:</strong> {new Date(selectedPostDetails.created_at * 1000).toLocaleString()}</p> */}
              
              <div className="flex items-center justify-between mt-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  RSVP required : {selectedPostDetails.participant_ids && selectedPostDetails.participant_ids.length >= selectedPostDetails.max_people ? 'No' : 'Yes'}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  RSVP counts : {selectedPostDetails.participant_ids ? selectedPostDetails.participant_ids.length : 0} / {selectedPostDetails.max_people}
                </span>
              </div>
            </div>
            <div className="max-w-xl mx-auto mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          {selectedPostDetails.comments && selectedPostDetails.comments.length > 0
            ? renderComments(selectedPostDetails.comments)
            : <p>No comments yet.</p>}
        </div>
<div className="mt-4">
  <h2 className="text-lg font-semibold mb-2">Add a Comment</h2>
  <form onSubmit={(e) => {
    e.preventDefault();
    submitComment();
  }} className="flex flex-col">
    <textarea
      className="w-full p-2 mb-2 rounded text-gray-900"
      placeholder="Your comment"
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      required
    />
    <button
      type="submit"
      disabled={isCommentSubmitting}
      className="self-end px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-400"
    >
      {isCommentSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  </form>
</div>

          </SectionContainer>
        </div>
      );
      
      
  };

  if (isLoading) return <div>Loading...</div>;
  return selectedPostId ? renderPostDetails() : renderPostList();
};

export default PostListPage;
