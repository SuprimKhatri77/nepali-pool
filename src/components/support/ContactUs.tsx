"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactSection() {
  return (
    <div className="bg-background shadow-md flex-col text-foreground min-h-screen flex items-center justify-center px-6 py-16">
       <h1 className="text-3xl font-medium">Contact Us</h1>
      <Card className="w-full max-w-5xl border-none shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 p-0">
          {/* Left Section */}
          <div className="bg-muted/30 p-10 flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-4">Get in touch</h1>
            <p className="text-gray-600 mb-8">
              Have any questions or suggestions? We’d love to hear from you!
              Our team is ready to assist you.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span>+977 9867473181</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span>nepalipool77@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Butwal, Nepal</span>
              </div>
            </div>
          </div>

          {/* Right Section (Form) */}
          <div className="px-4 py-10 sm:p-10">
            <form className="space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" className="mt-2" />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" className="mt-2" />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Type your message..." className="mt-2" />
              </div>

              {/* after updating privacy policy set this:  */}

              {/* <div className="flex items-center gap-2">
                <input type="checkbox" id="privacy" className="accent-primary" />
                <Label htmlFor="privacy" className="text-sm text-gray-600">
                  By selecting this, you agree to our{" "}
                  <a href="#" className=" underline text-primary">
                    Privacy Policy
                  </a>.
                </Label>
              </div> */}

              <Button type="submit" className="w-full">
                Send message
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
