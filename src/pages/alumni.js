import Layout from "../app/components/Layout2";
import Image from 'next/image';
import Link from 'next/link';

import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Alumni() {
  return (
    <Layout templateText="Alumni">
      <section className="p-6 bg-gray-100">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-center mb-6">Alumni</h1>
          <p className="text-lg text-gray-700 text-center mb-6">
            Welcome to the GlenView 2 High School Alumni Page! Stay connected with your fellow alumni, share your experiences, and find out about upcoming events and reunions.
          </p>

          <div className="my-8">
            <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>Annual Alumni Reunion - August 25, 2024</li>
              <li>Homecoming Football Game - September 10, 2024</li>
              <li>Networking Event - October 15, 2024</li>
            </ul>
          </div>

          <div className="my-8">
            <h2 className="text-2xl font-bold mb-4">Alumni Spotlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <Image
                  src="/images/alumni1.jpg"
                  alt="Alumni 1"
                  width={200}
                  height={200}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-center">Jane Doe</h3>
                <p className="text-gray-600 text-center">Class of 2010</p>
                <p className="text-gray-700 mt-2">Jane is a successful entrepreneur who founded her own tech startup.</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <Image
                  src="/images/alumni2.jpg"
                  alt="Alumni 2"
                  width={200}
                  height={200}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-center">John Smith</h3>
                <p className="text-gray-600 text-center">Class of 2012</p>
                <p className="text-gray-700 mt-2">John is a renowned scientist working on groundbreaking research in renewable energy.</p>
              </div>
            </div>
          </div>

          <div className="my-8">
            <h2 className="text-2xl font-bold mb-4">Stay Connected</h2>
            <p className="text-gray-700 mb-4">Join our alumni network on social media:</p>
            <div className="flex space-x-4 justify-center">
              <Link href="https://www.facebook.com/your-school-page" passHref>
                <div className="text-gray-700 hover:text-gray-900">
                  <FaFacebook size={30} />
                </div>
              </Link>
              <Link href="https://www.twitter.com/your-twitter-page" passHref>
                <div className="text-gray-700 hover:text-gray-900">
                  <FaTwitter size={30} />
                </div>
              </Link>
              <Link href="https://www.instagram.com/your-instagram-page" passHref>
                <div className="text-gray-700 hover:text-gray-900">
                  <FaInstagram size={30} />
                </div>
              </Link>
              <Link href="https://www.linkedin.com/your-linkedin-page" passHref>
                <div className="text-gray-700 hover:text-gray-900">
                  <FaLinkedin size={30} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
