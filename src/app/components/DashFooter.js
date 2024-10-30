import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const Footer = () => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggle modal open/close
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

      {/* Fixed menu at the bottom with transparent background */}
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

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={toggleModal} // Close modal on background click
        >
          <div class="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5">
            <div class="p-4">
              <div class="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                <div class="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                  <svg class="h-6 w-6 text-gray-600 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                  </svg>
                </div>
                <div>
                  <Link href="/admin/addHeader" class="font-semibold text-gray-900">
                    Add Titles
                    <span class="absolute inset-0"></span>
                  </Link>
                  <p class="mt-1 text-gray-600">Upload new titles</p>
                </div>
              </div>
              <div class="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                <div class="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                  <svg class="h-6 w-6 text-gray-600 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
                  </svg>
                </div>
                <div>
                  <Link href="/web/addDict" class="font-semibold text-gray-900">
                    Dictionary
                    <span class="absolute inset-0"></span>
                  </Link>
                  <p class="mt-1 text-gray-600">Add data into t_dict table</p>
                </div>
              </div>
              <div class="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                <div class="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                  <svg class="h-6 w-6 text-gray-600 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
                  </svg>
                </div>
                <div>
                  <Link href="/web/uploads/bannerUploads" class="font-semibold text-gray-900">
                    Banner details
                    <span class="absolute inset-0"></span>
                  </Link>
                  <p class="mt-1 text-gray-600">Upload banners links </p>
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
