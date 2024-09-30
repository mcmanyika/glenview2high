import React, { useEffect, useState } from 'react';
import { ref, get, update } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig'; // Adjust the path if needed
import { useRouter } from 'next/router'; // Import useRouter
import BlogPost from './BlogPost'; // Adjust the path if needed

const BlogList = () => {
  const router = useRouter(); // Initialize useRouter
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // Number of posts per page

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

  return (
    <div className="p-6 bg-white mt-4 rounded">
      <h1 className="text-2xl font-bold mb-4">Blog Posts</h1>
      
      <table className="min-w-full border-collapse table-auto text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map(post => (
            <tr key={post.id}>
              <td 
                className="border px-4 py-2">
                {post.title}
              </td>
              <td className="border px-4 py-2">{post.category}</td>
              <td className="border px-4 py-2">{new Date(post.createdAt).toLocaleString()}</td>
              <td className="border px-4 py-2">{post.status}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => router.push(`/admin/blogs/${post.id}`)} // Navigate to EditBlog
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
    </div>
  );
};

export default BlogList;
