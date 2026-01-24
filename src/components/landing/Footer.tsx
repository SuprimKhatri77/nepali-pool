"use client"
import Link from "next/link";
import {motion} from "framer-motion"
import Image from "next/image";
import { InfoIcon } from "lucide-react";

const exploreLinks = [
  { href: "/", name: "Home", id: 1 },
  { href: "/about-us", name: "About Us", id: 2 },
  { href: "/pricing", name: "Pricing", id: 3 },
  { href: "/schools", name: "Schools", id: 4 },
  { href: "/mentors", name: "Mentors", id: 5 },
  { href: "/blogs", name: "Blogs", id: 6 },
];
const detailLinks = [
  { href: "/blogs", name: "Blog", id: 1 },
  { href: "/faq", name: "FAQ", id: 2 },
  { href: "/support", name: "Support", id: 3 },
  { href: "/developers", name: "Developers", id: 4 },
];
const legalLinks = [
  { href: "/terms", name: "Terms", id: 1 },
  { href: "/privacy-policy", name: "Privacy Policy", id: 2 },
  { href: "/refund-policy", name: "Refund Policy", id: 3 },
  { href: "/cancellation", name: "Cancellation", id: 4 },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* grid md:grid-cols-5 gap-6 lg:gap-8 */}
        <div className="grid md:grid-cols-5 gap-6 lg:gap-8 mb-8">
          {/* Logo & Social */}
          <div className="md:col-span-1">
  <div className="flex items-center gap-2 mb-4">
    <motion.div
      className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-sm group-hover:shadow-md transition-all duration-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Image src={"/logoTransparent.png"} alt="NepaliPool Transparent Logo" width={150} height={70} />
    </motion.div>
    <span className="font-semibold text-lg text-gray-900">
      NepaliPool
    </span>
  </div>
  <div className="w-16 h-1 bg-emerald-600 rounded-full mb-4"></div>
  <p className="text-sm text-gray-600 mb-4">
    Connecting dreams to reality
  </p>
  
  {/* Social Media */}
  <div className="mt-6">
    <h3 className="text-sm font-semibold text-gray-900 mb-3">Follow Us</h3>
    <div className="flex gap-3">
      <a 
        href="https://www.facebook.com/nepalipooldotcom" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-9 h-9 bg-gray-100 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors duration-200 group"
      >
        <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </a>
      
      <a 
        href="https://www.youtube.com/@nepalipooldotcom" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-9 h-9 bg-gray-100 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors duration-200 group"
      >
        <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      </a>
      
      <a 
        href="https://www.tiktok.com/@nepalipool.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-9 h-9 bg-gray-100 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors duration-200 group"
      >
        <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      </a>

      <a 
        href="https://www.facebook.com/nepalipooldotcom" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-9 h-9 bg-gray-100 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors duration-200 group"
      >
        <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/>
        </svg>
      </a>
    </div>
  </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Explore</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {exploreLinks.map((item) => (
                
                <motion.li  key={item.id}>
                  <Link href={item.href} className="hover:text-emerald-600">
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Details */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Details</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {detailLinks.map((item) => (
                <motion.li  key={item.id}>
                  <Link href={item.href} className="hover:text-emerald-600">
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Important Notices */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {legalLinks.map((item) => (
              
                <motion.li  key={item.id}>
                  <Link href={item.href} className="hover:text-emerald-600">
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Butwal, Nepal</li>
              <li>
  <a href="tel:9867473181" className="hover:text-emerald-600 transition-colors">
    9867473181
  </a>
</li>
<li>
  <a href="tel:9817487614" className="hover:text-emerald-600 transition-colors">
    9817487614
  </a>
</li>
<li>
  <a href="mailto:support@nepalipool.com" className="hover:text-emerald-600 transition-colors  md:tracking-tighter">
    support@nepalipool.com
  </a>
</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
  <p className="text-sm text-center text-red-800 flex items-center justify-center gap-1">
    <InfoIcon  className="text-red-500 size-8" />
    यो प्लेटफर्म विद्यार्थीहरूलाई mentor तथा अन्य विद्यार्थीहरूसँग जोड्ने शैक्षिक माध्यम मात्र हो।
    हामी कन्सल्टेन्सी वा भिसा एजेन्सी होइनौं।
    भिसा, admission वा application सम्बन्धी अन्तिम निर्णय सम्बन्धित संस्था र embassy मा निर्भर गर्दछ।
  </p>
</div>


        {/* Copyright */}
        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-600">
            Copyright © {new Date().getFullYear()} NepaliPool. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
