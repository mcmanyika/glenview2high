import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig';
import Layout from '../../app/components/Layout2';

const BlogDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const blogRef = ref(database, `blogs/${id}`);
      onValue(
        blogRef,
        (snapshot) => {
          const blogData = snapshot.val();
          setBlog(blogData);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching blog details: ", error);
          setLoading(false);
        }
      );
    }
  }, [id]);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto text-2xl m-5">
        {blog && (
          <div className="text-gray-800 p-2 mb-6">
            <h1 className="capitalize text-2xl md:text-4xl font-semibold">{blog.title}</h1>
            <p className="text-sm text-gray-600 mb-10">By {blog.author}</p>
            <div
              className="blog-content font-thin text-lg"
              dangerouslySetInnerHTML={{ __html: blog.content }} // Render rich text content
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BlogDetails;
