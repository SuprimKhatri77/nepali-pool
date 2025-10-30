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
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border border-gray-200/50 shadow-xl rounded-2xl overflow-hidden backdrop-blur-sm bg-white/80">
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 p-0 gap-0">
              {/* Left Section - Contact Info */}
              <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 sm:p-10 md:p-12 flex flex-col justify-center overflow-hidden">
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
                          href="mailto:nepalipool77@gmail.com"
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
                      Follow us on social media
                    </p>
                    <div className="flex gap-3">
                      {["facebook", "twitter", "instagram"].map(
                        (social, index) => (
                          <motion.a
                            key={social}
                            href="#"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                          >
                            <span className="text-white text-xs font-bold uppercase">
                              {social[0]}
                            </span>
                          </motion.a>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Form */}
              <div className="p-6 sm:p-8 md:p-10 lg:p-12">
                <motion.form
                  initial={{ opacity: 0 }}
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
