"use client";
import { motion } from "framer-motion";
import { Clipboard, GraduationCap, Handshake, MessageCircle, Watch, Globe } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const countries = [
  { 
    name: "UK", 
    code: "gb",
    flag: "https://flagcdn.com/gb.svg",
    meetingLink: "https://meet.google.com/foh-bfoj-atr",
    chatLink: "https://m.me/ch/AbaTeAj-1emyPCEe/"
  },
  { 
    name: "USA", 
    code: "us",
    flag: "https://flagcdn.com/us.svg",
    meetingLink: "https://meet.google.com/foh-bfoj-atr",
    chatLink: "https://m.me/ch/AbaTeAj-1emyPCEe/"
  },
  { 
    name: "Japan", 
    code: "jp",
    flag: "https://flagcdn.com/jp.svg",
    meetingLink: "https://meet.google.com/foh-bfoj-atr",
    chatLink: "https://m.me/ch/AbaTeAj-1emyPCEe/"
  },
  { 
    name: "South Korea", 
    code: "kr",
    flag: "https://flagcdn.com/kr.svg",
    meetingLink: "https://meet.google.com/foh-bfoj-atr",
    chatLink: "https://m.me/ch/AbaTeAj-1emyPCEe/"
  },
  { 
    name: "Australia", 
    code: "au",
    flag: "https://flagcdn.com/au.svg",
    meetingLink: "https://meet.google.com/foh-bfoj-atr",
    chatLink: "https://m.me/ch/AbaTeAj-1emyPCEe/"
  },
];

export default function GroupCalls() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, 120, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="absolute -top-48 -right-48 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.1, 1.4, 1.1], rotate: [0, -90, 0] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-52 -left-52 w-80 h-80 bg-teal-300/25 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 40, 0], x: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 left-1/4 w-72 h-72 bg-cyan-300/20 rounded-full blur-2xl"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Time Badge */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur-md border border-emerald-200 rounded-full px-6 py-3 mb-10 shadow-lg"
          >
            <Watch className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-800 font-bold text-sm sm:text-base">
              Every Day at <span className="text-emerald-600">4:00 PM NPT</span>
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
              Connect
            </span>{" "}
            <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              Share
            </span>{" "}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent inline-block"
            >
              Grow.
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-10 font-medium max-w-3xl mx-auto"
          >
            Join daily group calls with students heading to the <span className="text-emerald-600 font-bold">same country</span> as you.
          </motion.p>

          {/* Flag Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center items-center gap-3 sm:gap-5 mb-12 flex-wrap"
          >
            {countries.map((country, i) => (
              <motion.div
                key={country.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                whileHover={{ scale: 1.25, rotate: 8, y: -8 }}
                className="relative group cursor-pointer"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shadow-xl border-4 border-white ring-2 ring-emerald-100 group-hover:ring-emerald-400 transition-all duration-300">
                  <Image
                    src={country.flag}
                    alt={country.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                  <span className="text-xs font-bold text-emerald-700 bg-white px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                    {country.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto"
          >
            {[
              { icon: MessageCircle, title: "Daily Group Calls", desc: "Talk live with peers every day at 4 PM" },
              { icon: GraduationCap, title: "Share Knowledge", desc: "Visas, universities, scholarships & more" },
              { icon: Handshake, title: "Build Friendships", desc: "Meet your future classmates early" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-white/70 backdrop-blur-lg border border-emerald-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          
           
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-emerald-600"
          >
            <span className="text-sm font-medium">Explore Groups</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round"  strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Country Groups Section */}
      <section id="group-call-list" className="px-6 py-20 bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Pick Your Destination
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Join the daily group call for students moving to <span className="font-semibold text-emerald-600">your country</span>
            </p>
          </motion.div>

          <CountryCards countries={countries} />
        </div>
      </section>
    </div>
  );
}

// === Country Cards Component ===
function CountryCards({ countries }: { countries: typeof countries }) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (link: string, code: string) => {
    navigator.clipboard.writeText(link);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {countries.map((country, i) => (
        <motion.div
          key={country.code}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.15 }}
          whileHover={{ y: -12, scale: 1.02 }}
          className="group relative  rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl  transition-all duration-500 max-w-[400px] w-full"
        >
          {/* Copy Button */}
          <button
            onClick={() => handleCopy(country.meetingLink, country.code)}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full  backdrop-blur-sm shadow-md bg-emerald-50 transition-all duration-300 group-hover:scale-110"
            aria-label="Copy meeting link"
          >
            <Clipboard className="w-5 h-5 text-emerald-600" />
            {copied === country.code && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-10 right-0 bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap"
              >
                Copied!
              </motion.span>
            )}
          </button>

          {/* Flag Header */}
          <div className="relative h-52   flex items-center justify-center overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.15, rotate: 6 }}
              transition={{ duration: 0.4 }}
              className="relative z-10"
            >
              <Image
                src={country.flag}
                alt={country.name}
                width={140}
                height={140}
                className="w-full drop-shadow-2xl"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-100 transition-opacity duration-500" />
          </div>

          {/* Content */}
          <div className="p-7">
            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
              {country.name}
            </h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Daily group call for students moving to <strong>{country.name}</strong>
            </p>

            <div className="flex flex-col gap-3">
              {/* Chat Button */}
              <a
                href={country.chatLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3.5 px-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
              >
                <MessageCircle className="w-5 h-5 group-hover/btn:animate-pulse" />
                <span>Join Group Chat</span>
              </a>

              {/* Live Call Button or Countdown */}
              <LiveCallButton country={country} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// === Live Call Button with Smart Countdown ===
function LiveCallButton({ country }: { country: typeof countries[0] }) {
  const [isLive, setIsLive] = useState(false);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const nptOffset = 5.75 * 60 * 60 * 1000; // NPT = UTC + 5:45
      const nptTime = new Date(now.getTime() + nptOffset);

      const hours = nptTime.getUTCHours();
      const minutes = nptTime.getUTCMinutes();

      const isCallTime =
        (hours === 15 && minutes >= 59) || // 3:59 PM NPT
        hours === 16 || 
        (hours === 17 && minutes <= 1);   // 5:01 PM NPT

      if (isCallTime) {
        setIsLive(true);
      } else {
        setIsLive(false);

        // Target: Today 3:59 PM NPT
        const target = new Date(nptTime);
        target.setUTCHours(15, 59, 0, 0);

        if (nptTime > target) {
          target.setUTCDate(target.getUTCDate() + 1);
        }

        const diff = target.getTime() - nptTime.getTime();
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        setCountdown(`${h}h ${m}m ${s}s`);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [country]);

  if (isLive) {
    return (
      <a
        href={country.meetingLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-3.5 px-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
      >
        <div className="relative">
          <div className="w-3 h-3 bg-white rounded-full animate-ping absolute inset-0" />
          <div className="w-3 h-3 bg-white rounded-full relative" />
        </div>
        <span>LIVE NOW – Join Call</span>
      </a>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold py-3.5 px-5 rounded-xl border border-gray-200">
      <Watch className="w-5 h-5" />
      <span>Starts in {countdown}</span>
    </div>
  );
}