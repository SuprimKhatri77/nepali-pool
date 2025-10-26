"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for reaching out! We’ll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-green-50 text-gray-900">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-gray-900"
        >
          Contact <span className="text-green-600">Us</span>
        </motion.h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Have questions, feedback, or partnership ideas? We&apos;d love to hear from you!
        </p>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Send us a <span className="text-green-600">Message</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Write your message here..."
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white resize-none"
              ></textarea>
            </div>

            <div className="text-center">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200"
              >
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-500 text-white text-center">
        <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
        <p className="text-lg mb-8 text-white/90 max-w-xl mx-auto">
          You can also reach us through the following channels:
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-8">
          <div>
            <h3 className="font-semibold text-xl">📧 Email</h3>
            <p className="text-white/90 mt-2">support@nepalipool.com</p>
          </div>
          <div>
            <h3 className="font-semibold text-xl">📍 Location</h3>
            <p className="text-white/90 mt-2">Kathmandu, Nepal</p>
          </div>
          <div>
            <h3 className="font-semibold text-xl">📞 Phone</h3>
            <p className="text-white/90 mt-2">+977-9800000000</p>
          </div>
        </div>
      </section>
    </main>
  );
}
