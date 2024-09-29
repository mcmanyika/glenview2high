import React from 'react';

const BlogPost = ({ title, category, createdAt, status }) => {
  return (
    <div className="p-2 bg-white  border-b mb-4">
      <h2 className="text-lg font-bold uppercase">{title}</h2>
      <div className="text-gray-600 mb-2">
        <span className="text-sm mr-4">Category: {category}</span> <br/>
        <span className='text-sm'>Created At: {new Date(createdAt).toLocaleString()}</span>
      </div>
      <div className="text-sm">
        <strong>Status:</strong> {status}
      </div>
    </div>
  );
};

export default BlogPost;
