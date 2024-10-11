import Link from 'next/link';

const Overlay = ({ isOverlay, toggleOverlay }) => {
  return (
    <div className={`fixed top-0 right-0 w-full z-50 h-full bg-main3 transition-transform duration-500 ease-in-out ${isOverlay ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex items-center justify-center h-full p-10">
        <div className="text-white text-center">
          <h2 className="text-2xl md:text-4xl font-thin">Student Application</h2>
          <p className="mt-4 text-base md:text-lg">
            As a new student you can now apply online, click below to start the process.
          </p>
          <Link href="/admin/dashboard">
            <button className="inline-block mt-4 px-6 py-2 bg-main text-white rounded-full transition duration-300">
              Apply Now
            </button>
          </Link>
          <button
            onClick={toggleOverlay}
            className="absolute top-4 right-4 text-white text-xl font-semibold"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overlay;
