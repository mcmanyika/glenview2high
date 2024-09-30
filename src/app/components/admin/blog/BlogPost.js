import React from 'react';

const BlogPost = ({ title, category, createdAt, status, onEditStatus }) => {
  return (
    <tr className="bg-white border-b">
      <td className="px-4 py-2">{title}</td>
      <td className="px-4 py-2">{category}</td>
      <td className="px-4 py-2">{new Date(createdAt).toLocaleString()}</td>
      <td className="px-4 py-2">
        {status}
        <button
          className="ml-4 text-blue-500 hover:underline"
          onClick={onEditStatus}
        >
          Edit Status
        </button>
      </td>
    </tr>
  );
};

export default BlogPost;
