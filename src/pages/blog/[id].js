import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig';
import Layout from '../../app/components/Layout2';
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill for client-side rendering only
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const BlogDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    if (id) {
      const blogRef = ref(database, `blogs/${id}`);
      onValue(blogRef, (snapshot) => {
        setBlog(snapshot.val());
      });
    }
  }, [id]);

  return (
    <Layout>
      <div className=" text-2xl">
        {blog ? (
          <>
            <div className="text-gray-800 mb-6">
            <p className='capitalize m-3'>{blog.title}</p>
              <ReactQuill 
                value={blog.content} 
                readOnly={true} 
                theme="bubble" // Using "bubble" theme for display purposes
                className="custom-quill"
              />
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </Layout>
  );
};

export default BlogDetails;
