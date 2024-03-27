"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SectionContainer from '../../components/SectionContainer';
import Header from '../../components/Header';
import { useSearchParams } from "next/navigation";

const PostDetailsPage = () => {
    const [selectedPostDetails, setSelectedPostDetails] = useState(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [comment, setComment] = useState('');
    const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const postId = searchParams.get("postId");
    const id = searchParams.get("id");
    const [hasRSVPd, setHasRSVPd] = useState(false);


    const submitComment = async () => {
        setIsCommentSubmitting(true);
        try {
            const response = await fetch('http://localhost:8000/v1/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: id, 
                    data: comment,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to submit comment.');
            }
            
            setComment('');
            //fetch the post details again to refresh comments
            window.location.reload();
        } catch (error) {
            console.error('Error submitting comment:', error);
        } finally {
            setIsCommentSubmitting(false);
        }
    };

    useEffect(() => {
        if (postId) {
            setIsLoadingDetails(true);
            fetch(`http://localhost:8000/v1/post/${postId}`, { method: "GET", })
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
    }, [postId]);

    const deletePost = async () => {
        try {
            const response = await fetch(`http://localhost:8000/v1/post/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 0,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete post.');
            }
            router.push('/postlist?id=${id}');
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };
    
    const handleDeleteClick = () => {
        const isConfirmed = window.confirm("Do you want to delete the post?");
        if (isConfirmed) {
            deletePost();
        }
    };    

    const deleteComment = async (commentId) => {
        try {
            const response = await fetch('http://localhost:8000/v1/comment', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: id,
                    post_id: postId,
                    comment_id: commentId,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete comment.');
            }
            
            window.location.reload(); // Fetch post details again to refresh comments
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleRSVP = async () => {
        try {
            const response = await fetch('http://localhost:8000/v1/rsvp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_id: postId,
                    user_id: id,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to RSVP to the event.');
            }
            window.location.reload();
        } catch (error) {
            console.error('Error RSVPing to the event:', error);
        }
    };
    const toggleRSVP = async () => {
        const url = 'http://localhost:8000/v1/rsvp';
        const method = hasRSVPd ? 'DELETE' : 'POST'; // Determine method based on current RSVP state
        
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_id: postId,
                    user_id: id,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to ${hasRSVPd ? 'cancel' : 'make'} RSVP.`);
            }

            // Toggle the RSVP state on successful RSVP/cancellation
            setHasRSVPd(!hasRSVPd);
            // Optionally, refresh the post details to reflect the new state
            window.location.reload();
        } catch (error) {
            console.error(error.message);
        }
    };

    // Determine initial RSVP state (assuming fetchPostDetails populates selectedPostDetails)
    useEffect(() => {
        if (selectedPostDetails && selectedPostDetails.participant_ids) {
            const isRSVPd = selectedPostDetails.participant_ids.includes(id);
            setHasRSVPd(isRSVPd);
        }
    }, [selectedPostDetails, [id]]);

    if (isLoadingDetails) return <div>Loading post details...</div>;
    if (!selectedPostDetails) return <div>Post details not found.</div>;

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
                {comment.user_id === id && (
                <button 
                    onClick={() => deleteComment(comment.id)} 
                    className="text-red-400 text-xs hover:text-red-700"
                    title="Delete comment"
                >
                    Delete
                </button>
                )}
            </div>
            ));
        };

        return (
            <div className="min-h-screen bg-gray-950 text-white">
            <Header />
            <SectionContainer>
            <div className="max-w-xl mx-auto my-6 p-6 rounded-lg bg-gray-900 shadow-lg">
            <div className="flex justify-between items-start mb-4">
            <div className="flex items-center text-sm font-medium mb-1">
            <svg className="h-4 w-4 text-gray-100 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5.121 17.121a1.5 1.5 0 00-2.121 2.122c1.378 1.378 3.5 2.364 5.974 2.745 1.062.164 2.162.164 3.225 0 2.473-.381 4.596-1.367 5.974-2.745a1.5 1.5 0 00-2.121-2.122 7.97 7.97 0 01-3.853 1.087 7.97 7.97 0 01-3.853-1.087z"></path>
                <path d="M12 1C8.318 1 5.5 4.036 5.5 7.95c0 2.344 1.312 4.424 3.257 5.65a8.049 8.049 0 007.486 0A6.95 6.95 0 0018.5 7.95C18.5 4.036 15.682 1 12 1z"></path>
            </svg>
            {selectedPostDetails.user_id} · {new Date(selectedPostDetails.created_at * 1000).toLocaleString()} 
            </div>
            {selectedPostDetails.user_id === id && (
                        <button 
                            onClick={handleDeleteClick} 
                            className="text-gray-400 text-xs hover:text-red-400"
                            title="Delete Post"
                        >
                            x
                        </button>
                    )}
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
                
                <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2"> {/* Adjust the gap as needed */}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        RSVP required: {selectedPostDetails.participant_ids && selectedPostDetails.participant_ids.length >= selectedPostDetails.max_people ? 'No' : 'Yes'}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        RSVP counts: {selectedPostDetails.participant_ids ? selectedPostDetails.participant_ids.length : 0} / {selectedPostDetails.max_people}
                    </span>
                </div>
                {selectedPostDetails.user_id != id && (
                    <button 
                        onClick={toggleRSVP} 
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${hasRSVPd ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-500'}`}
                    >
                        RSVP
                    </button>
                )}
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
                className="self-end px-4 py-2 bg-indigo-700 text-white rounded hover:bg-indigo-800 disabled:bg-indigo-400"
                >
                {isCommentSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </form>
            </div>
            </SectionContainer>
            </div>
        );           
    };
    return renderPostDetails();
};

export default PostDetailsPage;
