import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const Footer = () => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <footer className="text-gray-400 bg-admin-footer text-sm p-4">
        <div className="font-thin">
          &copy; Copyrights reserved {new Date().getFullYear()}. Developed by <b>SMART LEARNER</b>
        </div>
      </footer>

      {(session?.user?.email === 'mcmanyika@gmail.com' || session?.user?.email === 'partsonmdev@gmail.com') && (
        <div className="fixed w-full bottom-0 left-0 bg-transparent text-white text-center p-2">
          <button
            className="bg-gray-900 rounded-full text-white px-4 py-2 transition-all duration-300 ease-in-out hover:px-8"
            onClick={toggleModal}
          >
            Menu
          </button>
        </div>
      )}

      {/* Full Screen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 overflow-y-auto">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-4">
            <h2 className="text-xl font-semibold text-white">Admin Menu</h2>
            <button
              onClick={toggleModal}
              className="p-2 hover:bg-white/10 rounded-full text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            <div className="max-w-7xl mx-auto space-y-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
              <div className="group flex gap-x-6 rounded-lg p-4 hover:bg-white/10 transition-colors">
                <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-white/10 group-hover:bg-white/20">
                  <svg className="h-6 w-6 text-white group-hover:text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <Link href="/admin/addHeader" className="font-semibold text-white block hover:text-white/80">
                    Add Titles
                  </Link>
                  <p className="mt-1 text-white/70">Upload new titles</p>
                </div>
              </div>

              <div className="group flex gap-x-6 rounded-lg p-4 hover:bg-white/10 transition-colors">
                <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-white/10 group-hover:bg-white/20">
                  <svg className="h-6 w-6 text-white group-hover:text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
                  </svg>
                </div>
                <div className="flex-1">
                  <Link href="/web/addDict" className="font-semibold text-white block hover:text-white/80">
                    Dictionary
                  </Link>
                  <p className="mt-1 text-white/70">Add data into t_dict table</p>
                </div>
              </div>

              <div className="group flex gap-x-6 rounded-lg p-4 hover:bg-white/10 transition-colors">
                <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-white/10 group-hover:bg-white/20">
                  <svg className="h-6 w-6 text-white group-hover:text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
                  </svg>
                </div>
                <div className="flex-1">
                  <Link href="/web/uploads/bannerUploads" className="font-semibold text-white block hover:text-white/80">
                    Banner details
                  </Link>
                  <p className="mt-1 text-white/70">Upload banners links</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      )}
    </>
  );
};

export default Footer;
