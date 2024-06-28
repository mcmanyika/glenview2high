import React from 'react';

const NewStudents = () => {
  return (
    <div className="relative flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('images/book.png')" }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Dark overlay */}
      <section className="relative text-white p-10 md:p-15 text-center">
        <h1 className="text-3xl md:text-3xl font-thin font-sans uppercase">Welcome New Students</h1>
        <p className="mt-4 text-base md:text-lg">
          <button className="uppercase p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300">
            Find out more
          </button>
        </p>
      </section>
    </div>
  );
};

export default NewStudents;
