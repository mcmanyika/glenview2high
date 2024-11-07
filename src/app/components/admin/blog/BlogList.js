import React, { useEffect, useState } from 'react';
import { ref, get, remove } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { useRouter } from 'next/router';
import Link from 'next/link';

const BlogList = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsRef = ref(database, 'blogs');
      const snapshot = await get(postsRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedPosts = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        formattedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(formattedPosts);
      }
    };

    fetchPosts();
  }, []);

  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDeleteClick = (postId) => {
    setPostToDelete(postId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    const postRef = ref(database, `blogs/${postToDelete}`);
    await remove(postRef);
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postToDelete));
    setShowModal(false);
    setPostToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setPostToDelete(null);
  };

  return (
    <div className="text-sm p-4 sm:p-6 bg-white mt-4 rounded">
      <h1 className="text-lg sm:text-2xl font-bold mb-4">Blog Posts</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-2 sm:px-4 py-2">Title</th>
              <th className="px-2 sm:px-4 py-2">Category</th>
              <th className="px-2 sm:px-4 py-2">Created At</th>
              <th className="px-2 sm:px-4 py-2">Status</th>
              <th className="px-2 sm:px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((post) => (
              <tr key={post.id} className="border-b">
                <td className="border px-2 sm:px-4 py-2">
                  <Link
                    href={`/blog/${post.id}`}
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {post.title}
                  </Link>
                </td>
                <td className="border px-2 sm:px-4 py-2">{post.category}</td>
                <td className="border px-2 sm:px-4 py-2">{new Date(post.createdAt).toLocaleString()}</td>
                <td className="border px-2 sm:px-4 py-2">{post.status}</td>
                <td className="border px-2 sm:px-4 py-2">
                  <div className='p-1'>
                    <button
                      onClick={() => router.push(`/admin/blogs/${post.id}`)}
                      className="bg-blue-500 text-white px-4 py-1 text-xs rounded"
                    >
                      Edit
                    </button>
                  </div>
                  <div className='p-1'>
                    <button
                      onClick={() => handleDeleteClick(post.id)}
                      className="bg-red-500 text-white px-2 py-1 text-xs rounded "
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 text-xs sm:text-sm">
        <button
          onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-3 py-1 rounded mb-2 sm:mb-0 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="mb-2 sm:mb-0">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-11/12 max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this blog post?</p>
            <div className="flex justify-end mt-4">
              <div className='p-1'>
                <button
                  onClick={handleCancelDelete}
                  className="bg-gray-300 text-black rounded"
                >
                  Cancel
                </button>
              </div>
              <div className='p-1'>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogList;
