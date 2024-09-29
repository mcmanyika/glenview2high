import React from 'react';

const BlogPost = ({ title, category, createdAt, status }) => {
  return (
    <div className="p-4 bg-white rounded shadow-md mb-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="text-gray-600 mb-2">
        <span className="mr-4">Category: {category}</span>
        <span>Created At: {new Date(createdAt).toLocaleString()}</span>
      </div>
      <div className="text-sm">
        <strong>Status:</strong> {status}
      </div>
    </div>
  );
};

export default BlogPost;
