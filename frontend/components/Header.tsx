import React from 'react';
// Import your logo image here
// import Logo from '/path/to/your/logo.png';

const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-950 shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            {/* Replace below div with an img tag to add your logo */}
            <div className="text-xl font-bold text-gray-800 dark:text-white">
              {/* <img src={Logo} alt="Logo" className="h-8 w-8 mr-2" /> */}
              Team Summit
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-gray-800 dark:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Posts
                </a>
                {/* <a href="#" className="text-gray-800 dark:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Tags
                </a>
                <a href="#" className="text-gray-800 dark:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Projects
                </a>
                <a href="#" className="text-gray-800 dark:text-white px-3 py-2 rounded-md text-sm font-medium">
                  About
                </a> */}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {/* <button className="bg-gray-800 dark:bg-gray-200 p-1 rounded-full text-white dark:text-gray-800 hover:text-gray-400 dark:hover:text-gray-600">
                
              </button> */}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
