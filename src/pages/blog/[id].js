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
      <div className="text-2xl m-5">
        {blog && (
          <div className="text-gray-800 mb-6">
            <h1 className="capitalize text-4xl font-semibold mb-4">{blog.title}</h1>
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }} // Render rich text content
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BlogDetails;
