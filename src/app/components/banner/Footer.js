"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { database } from '../../../../utils/firebaseConfig';
import { ref, onValue } from 'firebase/database';

export default function Footer() {
  const [schoolInfo, setSchoolInfo] = useState({
    address: '',
    phone: '',
    logo: '',
    email: '',
    schoolName: ''
  });

  useEffect(() => {
    const accountRef = ref(database, 'account');
    onValue(accountRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSchoolInfo({
          address: data.address || '',
          phone: data.phone || '',
          logo: data.logo || '',
          email: data.email || '',
          schoolName: data.schoolName || ''
        });
      }
    });
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-blue-900 dark:bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start w-full gap-8 md:gap-0">
          {/* School Logo */}
          <div className="w-full md:w-auto">
            {schoolInfo.logo && (
              <Image 
                src={schoolInfo.logo} 
                alt={schoolInfo.schoolName} 
                width={80} 
                height={80} 
                className="rounded-full"
              />
            )}
          </div>
          {/* Quick Links */}
          <div className="w-full md:w-auto">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Vision', href: '#' },
                { name: 'School Life', href: '#gallery' },
                { name: 'News & Events', href: '#' }
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-blue-100 hover:text-white transition-colors text-sm">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="w-full md:w-auto">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {[
                { name: 'Staff ', href: '/admin/login' },
                { name: 'Student Portal', href: '/admin/login' },
                { name: 'Parent Portal', href: '/admin/login' },
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-blue-100 hover:text-white transition-colors text-sm">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="w-full md:w-auto">
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm text-blue-100">
                    {schoolInfo.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm text-blue-100">
                    {schoolInfo.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm text-blue-100">
                    {schoolInfo.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-blue-800 dark:border-slate-800">
          <div className="flex justify-center items-center">
            <p className="text-sm p-4 text-blue-100 dark:text-white">
              © {new Date().getFullYear()} {schoolInfo.schoolName}. Developed by{" "}
              <a href="https://smartlearner.co.zw" className="hover:text-blue-400" target="_blank">
                SMART LEARNER
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}