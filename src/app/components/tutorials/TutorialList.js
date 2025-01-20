'use client';
import React, { useState, useEffect } from 'react';
import { database } from "../../../../utils/firebaseConfig";
import { ref, onValue, push, update, remove } from 'firebase/database';
import withAuth from '../../../../utils/withAuth';


const TutorialList = () => {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const tutorialsPerPage = 12;

  useEffect(() => {
    const tutorialsRef = ref(database, 'tutorials');
    
    onValue(tutorialsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tutorialsList = Object.entries(data).map(([id, tutorial]) => ({
          id,
          ...tutorial
        }));
        setTutorials(tutorialsList);
      }
      setLoading(false);
    });
  }, []);

  const handleTutorialClick = (tutorial) => {
    setSelectedTutorial(tutorial);
  };

  // Filter tutorials based on search term and difficulty
  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || tutorial.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  // Calculate pagination with filtered tutorials
  const indexOfLastTutorial = currentPage * tutorialsPerPage;
  const indexOfFirstTutorial = indexOfLastTutorial - tutorialsPerPage;
  const currentTutorials = filteredTutorials.slice(indexOfFirstTutorial, indexOfLastTutorial);
  const totalPages = Math.ceil(filteredTutorials.length / tutorialsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleDifficultyChange = (difficulty) => {
    setDifficultyFilter(difficulty);
    setCurrentPage(1); // Reset to first page when filtering
  };

  if (loading) {
    return <div>Loading tutorials...</div>;
  }

  return (
    <div>
      {/* Filter Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search tutorials..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          <button
            onClick={() => handleDifficultyChange('all')}
            className={`px-4 py-2 rounded-lg ${
              difficultyFilter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleDifficultyChange('beginner')}
            className={`px-4 py-2 rounded-lg ${
              difficultyFilter === 'beginner'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => handleDifficultyChange('intermediate')}
            className={`px-4 py-2 rounded-lg ${
              difficultyFilter === 'intermediate'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Intermediate
          </button>
          <button
            onClick={() => handleDifficultyChange('advanced')}
            className={`px-4 py-2 rounded-lg ${
              difficultyFilter === 'advanced'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Advanced
          </button>
        </div>
      </div>

      {selectedTutorial ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl">
            <div className="aspect-video mb-4">
              <iframe
                className="w-full h-full"
                src={selectedTutorial.youtubeUrl.replace('watch?v=', 'embed/')}
                title={selectedTutorial.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <h2 className="text-xl font-bold m-4">{selectedTutorial.title}</h2>
            <button
              onClick={() => setSelectedTutorial(null)}
              className="px-4 py-2 m-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentTutorials.length > 0 ? (
          currentTutorials.map((tutorial) => (
            <div
              key={tutorial.id}
              className="bg-white rounded-lg  overflow-hidden cursor-pointer"
              onClick={() => handleTutorialClick(tutorial)}
            >
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{tutorial.title}</h3>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    tutorial.difficulty === 'beginner' 
                      ? 'bg-green-100 text-green-800'
                      : tutorial.difficulty === 'intermediate'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {tutorial.difficulty}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No tutorials found matching your criteria
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredTutorials.length > tutorialsPerPage && (
        <div className="flex justify-center gap-2 mt-4 mb-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Previous
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default withAuth(TutorialList);