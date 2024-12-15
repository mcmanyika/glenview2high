import React from 'react'
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { Card } from "../ui/card";
import Map from "../Map";

export default function Contact() {
  return (
    <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="pb-20 pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/30 to-white/80 dark:from-slate-900/50 dark:to-slate-800/30"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white uppercase">
              Get in Touch
            </h2>
            <p className="mt-4 text-xl font-thin text-gray-600 dark:text-gray-300">
              We are here to help and answer any questions you might have
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              {[
                { icon: <MapPin />, title: "Visit Us", content: "Corner Lavenham Drive & Northolt Road, Bluffhill, Harare" },
                { icon: <Phone />, title: "Call Us", content: "+263 77 275 1531" },
                { icon: <Mail />, title: "Email Us", content: "divarismakaharis@gmail.com" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.2,
                    ease: "easeOut"
                  }}
                  whileHover={{
                    x: 15,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Card className="p-8 hover:shadow-xl transition-all duration-300 border-blue-100/20 dark:bg-slate-800/50 dark:border-slate-700 backdrop-blur-sm">
                    <div className="space-y-8">
                      <div className="flex items-start space-x-4 group">
                        <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg dark:text-white mb-1">{item.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.content}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
                    
            {/* Map */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="h-[430px] rounded-2xl overflow-hidden shadow-lg border border-blue-100/20 dark:border-slate-700"
            >
              <Map />
            </motion.div>
          </div>
        </div>
      </motion.section>
  )
}
