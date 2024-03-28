import React from 'react';
import { useRouter } from 'next/navigation';

const Header = ({id}) => {
  const router = useRouter();
  return (
    <header className="bg-white dark:bg-gray-950 shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-xl font-bold text-gray-800 dark:text-white">
              Team Summit
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
              <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/postlist?id=${id}`);
                  }}
                  className="text-gray-800 dark:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Posts
                </a>
              </div>
            </div>
          </div>
          <div>
          <button 
            onClick={() => router.push(`/user?id=${id}`)} 
            className="px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-5 w-5 text-gray-800 dark:text-white" fill="currentColor">
              <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/>
            </svg>
          </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;


