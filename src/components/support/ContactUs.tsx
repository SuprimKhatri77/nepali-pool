"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactSection() {
  return (
    <section className="relative bg-gradient-to-b from-white via-emerald-50/30 to-white min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20 overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Animated Gradient Blobs */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 -left-20 w-72 h-72 sm:w-96 sm:h-96 bg-emerald-300/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, 50, 0],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1/4 -right-20 w-72 h-72 sm:w-96 sm:h-96 bg-green-300/20 rounded-full blur-3xl"
      />

      <div className="w-full max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          // initial={{ opacity: 0, y: -20 }}
          // whileInView={{ opacity: 1, y: 0 }}
          // transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full mx-auto mb-4"></div>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Have questions or suggestions? We&apos;d love to hear from you. Our
            team is ready to assist you.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          // initial={{ opacity: 0, y: 20 }}
          // whileInView={{ opacity: 1, y: 0 }}
          // transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border border-gray-200/50 shadow-xl rounded-2xl overflow-hidden backdrop-blur-sm bg-white/80">
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 p-0 gap-0">
              {/* Left Section - Contact Info */}
              <div className="relative bg-gradient-to-tr from-emerald-400 to-emerald-700 p-8 sm:p-10 md:p-12 flex flex-col justify-center overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

                <div className="relative z-10">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                    Contact Information
                  </h2>
                  <p className="text-emerald-50 mb-8 sm:mb-12 text-sm sm:text-base">
                    Reach out to us through any of these channels. We&apos;re
                    here to help!
                  </p>

                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="flex items-start gap-4 group"
                    >
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-emerald-100 text-xs sm:text-sm font-medium mb-1">
                          Phone
                        </p>
                        <a
                          href="tel:+9779867473181"
                          className="text-white font-semibold text-sm sm:text-base hover:underline"
                        >
                          +977 9867473181
                        </a>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="flex items-start gap-4 group"
                    >
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-emerald-100 text-xs sm:text-sm font-medium mb-1">
                          Email
                        </p>
                        <a
                          href="mailto:support@nepalipool.com"
                          className="text-white font-semibold text-sm sm:text-base hover:underline break-all"
                        >
                          nepalipool77@gmail.com
                        </a>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                      className="flex items-start gap-4 group"
                    >
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-emerald-100 text-xs sm:text-sm font-medium mb-1">
                          Location
                        </p>
                        <p className="text-white font-semibold text-sm sm:text-base">
                          Butwal, Nepal
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Social Links */}
<div className="mt-10 sm:mt-12 pt-8 border-t border-white/20">
  <p className="text-emerald-100 text-sm mb-4">
    Follow us
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
        href="https://m.me/cm/AbYCo2T6A-3kPC0K/?send_source=cm%3Acopy_invite_link" 
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
                </div>
              </div>

              {/* Right Section - Form */}
              <div className="p-6 sm:p-8 md:p-10 lg:p-12">
                <motion.form
                  initial={{ opacity: 0, }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="space-y-5 sm:space-y-6"
                >
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-gray-700 font-medium text-sm"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="mt-2 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg h-11"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="text-gray-700 font-medium text-sm"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="mt-2 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg h-11"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="subject"
                      className="text-gray-700 font-medium text-sm"
                    >
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      placeholder="How can we help?"
                      className="mt-2 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg h-11"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="message"
                      className="text-gray-700 font-medium text-sm"
                    >
                      Message <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      className="mt-2 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg min-h-[120px] resize-none"
                    />
                  </div>

                  <motion.div
                    initial={{scaleX:0}}
                    whileInView={{scaleX:1, animationDuration: 0.5, transitionDuration: 0.4}}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-lg h-12 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </Button>
                  </motion.div>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    We&apos;ll get back to you within 24 hours
                  </p>
                </motion.form>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12"
        >
          {[
            { title: "Quick Response", desc: "Within 24 hours", icon: "⚡" },
            { title: "Expert Support", desc: "Experienced team", icon: "🎯" },
            { title: "Always Available", desc: "24/7 assistance", icon: "🌟" },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
