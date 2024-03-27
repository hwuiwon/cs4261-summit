"use client"
import React, { useState, useEffect } from 'react';
import SectionContainer from '../../components/SectionContainer';
import Header from '../../components/Header';
import userImage from '../../components/bg.png';
import { useRouter } from 'next/navigation';
import { useSearchParams } from "next/navigation";
import Image from 'next/image';

const UserDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false); 
  const [updatedSkills, setUpdatedSkills] = useState({}); 

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/v1/user/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        setUserData(data.user);
        setIsLoading(false);
        setUpdatedSkills(data.user.skills); 
      })
      .catch(error => {
        console.error('Failed to fetch user details:', error);
        setIsLoading(false);
      });
    }
  }, [id]);

  const deleteUser = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this account?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:8000/v1/user/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 0 }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete user.');
        }
        router.push(`http://localhost:3000/`);
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.');
      }
    }
  };

  const skillLevels = ["Beginner", "Advanced", "Competent", "Proficient", "Expert", "Undefined"];

  const handleSkillChange = (skill, level) => {
    setUpdatedSkills(prevSkills => ({
      ...prevSkills,
      [skill]: level,
    }));
  };

  const saveSkills = async () => {
    try {
      const response = await fetch('http://localhost:8000/v1/user/', { 
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: id, 
          skills: updatedSkills,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save updated skills.');
      }
  
      const data = await response.json();
      console.log('Skills saved:', data); 
      
      setUserData(data.user); 
      setShowDropdown(false); 
      alert('Skills updated successfully!'); 
    //   router.push(`/user?id=${id}`);
      window.location.reload();
    } catch (error) {
      console.error('Error saving skills:', error);
      alert('Error saving skills. Please try again.');
    }
  };
  

  if (isLoading) return <div>Loading...</div>;
  if (!userData) return <div>User not found.</div>;
  return (
    <>
      <div className="bg-gray-950 text-white">
        <Header id={id} />
        <SectionContainer>
          <div className="bg-gray-950 min-h-screen text-white flex flex-col items-center pt-8">
            <div className="avatar-container mb-3 rounded-full overflow-hidden w-50 h-50">
              <Image src={userImage} alt="User Image" width={200} height={200} />
            </div>
            <h2 className="text-3xl mb-1">{userData.name}</h2>
            <p className="text-md mb-1">@{userData.id}</p>
            <div className="points flex items-center mb-2">
              {/* point system */}
            </div>
            <div className="info mb-4 p-4 rounded-lg bg-black flex">
              <p className="mr-4">Skills:</p>
              <div className="flex-grow flex flex-col justify-start mr-28">
                {Object.entries(userData.skills).map(([skill, level]) => (
                  <span key={skill}>{skill} ({level as string})</span>
                ))}
              </div>
              <button onClick={() => setShowDropdown(!showDropdown)} className="bg-gray-800 text-white text-xs font-medium px-2.5 py-0.5 rounded self-start">
                {showDropdown ? "Close" : "Update Skills"}
              </button>
              {showDropdown && (
                <div className="flex flex-col ml-4">
                  {Object.entries(userData.skills).map(([skill, level]) => (
                    <select key={skill} onChange={(e) => handleSkillChange(skill, e.target.value)} value={updatedSkills[skill] || level} className="mb-2 bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded self-start">
                      {skillLevels.map((levelOption) => (
                        <option key={levelOption} value={levelOption}>{levelOption}</option>
                      ))}
                    </select>
                  ))}
                  <button onClick={saveSkills} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded mt-2">
                    Save Skills
                  </button>
                </div>
              )}
            </div>
            <div className="actions flex flex-col w-full p-4">
              <button className="my-2 py-2 rounded-lg bg-gray-700">My posts</button>
              <button className="my-2 py-2 rounded-lg bg-gray-700">Edit Profile</button>
              <button className="my-2 py-2 rounded-lg bg-gray-700">Settings</button>
              <button onClick = {deleteUser} className="my-2 py-2 rounded-lg bg-gray-700 hover:bg-gray-800">Delete Account</button>
            </div>
          </div>
        </SectionContainer>
      </div>
    </>
  );
  
   
};

export default UserDetails;

