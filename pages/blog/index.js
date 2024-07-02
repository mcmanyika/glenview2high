'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';

const BlogList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const postsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsList);
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Blog</h1>
      {posts.map(post => (
        <div key={post.id} className="mb-4">
          <Link href={`/blog/${post.id}`}>
            <a className="text-2xl font-semibold text-blue-600">{post.title}</a>
          </Link>
          <p>{post.excerpt}</p>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
