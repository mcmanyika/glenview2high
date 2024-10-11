import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig';
import Link from 'next/link';
import Layout from '../../app/components/Layout2';
import dynamic from 'next/dynamic';
import { FaSpinner } from 'react-icons/fa'; // Import FaSpinner

// Dynamically import SunEditor
const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });
import 'suneditor/dist/css/suneditor.min.css'; // Import SunEditor styles

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10); // Change this value to set how many blogs per page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const blogsRef = ref(database, 'blogs');
    onValue(
      blogsRef,
      (snapshot) => {
        const blogData = [];
        snapshot.forEach((childSnapshot) => {
          const blog = { id: childSnapshot.key, ...childSnapshot.val() };
          // Only include blogs that are published
          if (blog.status === 'Published') {
            blogData.push(blog);
          }
        });

        // Sort blogs by createdAt in descending order
        blogData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setBlogs(blogData);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );
  }, []);

  // Get current blogs for the current page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(blogs.length / postsPerPage);

  return (
    <Layout templateText="Latest News">
      <div className="max-w-5xl mx-auto bg-white mt-3 p-4">
        {loading ? (
          <div className="flex justify-center">
            <FaSpinner className="animate-spin text-blue-500" size={40} /> {/* Spinner icon */}
          </div>
        ) : error ? (
          <p>Error loading blogs: {error.message}</p>
        ) : blogs.length === 0 ? (
          <p>No blogs found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentBlogs.map((blog) => (
                <div key={blog.id} className="p-4 rounded-xxl shadow rounded hover:shadow-md">
                  <div className="text-gray-700 pt-2 mb-4">
                    {/* Display only images from blog content */}
                    {blog.content && (
                      <div className="blog-content">
                    <Link href={`/blog/${blog.id}`}>
                    {blog.content.replace(/<img /g, '<img class="rounded-xxl max-h-40 w-full" ').match(/<img[^>]*src="([^"]*)"[^>]*>/g)?.map((imgTag, index) => (
                            <div key={index} className="image-container rounded-xxl" dangerouslySetInnerHTML={{ __html: imgTag }} />
                          ))}
                        </Link>
                      </div>
                    )}
                  </div>

                  <Link href={`/blog/${blog.id}`}>
                    <div className="text-blue-500 text-2xl line-clamp-1 hover:underline capitalize">{blog.title}</div>
                  </Link>
                  <p className="text-sm text-gray-600">By {blog.author}</p>
                  {/* Read More Button */}
                  <div className="mt-8">
                    <Link href={`/blog/${blog.id}`}>
                      <button className="rounded-xxl bg-yellow-500 hover:bg-yellow-300 text-white px-4 py-2">
                        Read More
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default BlogList;
