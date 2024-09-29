import React, { useEffect, useState } from 'react';
import { ref, get, remove } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig'; // Adjust the path if needed
import BlogPost from './BlogPost'; // Adjust the path if needed
import StatusModal from './StatusModal'; // Import the StatusModal component
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa'; // Import the delete icon

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // Number of posts per page
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); // State to store the post being edited

  useEffect(() => {
    const fetchPosts = async () => {
      const postsRef = ref(database, 'blogs'); // Reference to the blogs node
      const snapshot = await get(postsRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedPosts = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));

        // Sort posts by createdAt in descending order
        formattedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(formattedPosts);
      }
    };

    fetchPosts();
  }, []);

  // Calculate total pages
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Get current posts for the current page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Open the modal and set the selected post
  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  // Update the local post status after modal close
  const handleStatusUpdate = (postId, newStatus) => {
    setPosts(posts.map(post => (post.id === postId ? { ...post, status: newStatus } : post)));
  };

  // Handle post deletion
  const handleDelete = async (postId) => {
    const postRef = ref(database, `blogs/${postId}`);
    try {
      await remove(postRef);
      setPosts(posts.filter(post => post.id !== postId)); // Remove post from local state
      toast.success('Post deleted successfully!'); // Notify user
    } catch (error) {
      toast.error('Error deleting post: ' + error.message); // Notify error
    }
  };

  return (
    <div className="p-6 bg-white m-3">
      <h1 className="text-2xl font-bold mb-4">Blog Posts</h1>
      {currentPosts.map(post => (
        <div key={post.id} className="flex justify-between items-center mb-4">
          <div className='w-full' onClick={() => openModal(post)}>
            <BlogPost
              title={post.title}
              category={post.category} // Assuming category is part of the post data
              createdAt={post.createdAt}
              status={post.status} // Assuming status is part of the post data
            />
          </div>
          <div className='p-2'>
          <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-700">
            <FaTrash size={20} />
          </button>

          </div>
        </div>
      ))}

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Status Modal */}
      <StatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        post={selectedPost}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default BlogList;
