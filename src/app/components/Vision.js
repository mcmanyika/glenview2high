import React from 'react';

const Vision = () => {
  return (
    <section id='vision'>
    <div className="relative parallax  min-h-80 bg-top" style={{ backgroundImage: "url('/images/d4.jpeg')" }}>
      <div className="absolute inset-0 bg-main opacity-50"></div>
      <div className="relative max-w-7xl mx-auto z-10 flex flex-col md:flex-row items-center justify-between h-full text-white p-4">
        <div className="flex-1 text-center  p-4">
          <h1 className="text-4xl md:text-5xl font-thin">Vision</h1>
          <p className="mt-4 text-xl max-w-3xl font-thin">
            <b>To be a trailblazer in the provision of quality education.</b><br /> Being a centre for educational excellence nationally, regionally and internationally, offering the best quality in the areas of academics, sports, social and cultural activities.
          </p>
        </div>
        <div className="flex-1 text-center  p-4">
          <h1 className="text-4xl md:text-5xl font-thin">Mission</h1>
          <p className="mt-4 text-xl  max-w-3xl font-thin">
            To provide a well balanced exit profile whose thoughts and mindset will catch up with time to avoid redundancy. Providing a well-rounded, high quality, and relevant education for learners. Providing an environment that nurtures the mind, body, and soul.
          </p>
        </div>
      </div>
    </div>
    </section>
  );
};

export default Vision;
