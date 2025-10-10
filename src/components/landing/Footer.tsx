import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="lg:rounded-md bg-white py-5 gap-8 shadow-md mt-4">
      <div className="flex lg:flex-row flex-col px-8">
        <div
          id="logoLinks"
          className="flex flex-col items-center justify-center max-w-[300px] w-full mx-auto"
        >
          <Image
            src="/landing/logo.png"
            alt="logo"
            width={138}
            height={158}
          ></Image>
          <p className="text-sm text-gray-600 mt-1 h-0.5 bg-amber-300 w-16"></p>
          <div>
            <h3 className="font-semibold text-base sm:text-xl">Social Links</h3>
            <ul>
              <li>
                <Link href={"/"}>
                  {" "}
                  <Image
                    src="https://t4.ftcdn.net/jpg/03/92/71/99/240_F_392719944_L0LYv3e7QozB2tsj3CfUN0HPC8eZQOWb.jpg"
                    alt="facebook"
                    width={100}
                    height={20}
                  ></Image>{" "}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div id="contentfooter">
          <div
            id="footgrid"
            className="flex flex-wrap justify-between sm:grid grid-cols-2 md:grid-cols-4 sm:mx-auto gap-2"
          >
            <div className="mt-3 ">
              <h3 className="font-semibold text-base sm:text-xl">Explore</h3>
              <ul className="mt-3 text-base">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/">About Us</Link>
                </li>
                <li>
                  <Link href="/">Pricing</Link>
                </li>
                <li>
                  <Link href="/">Schools</Link>
                </li>
                <li>
                  <Link href="/">Mentors</Link>
                </li>
                <li>
                  <Link href="/">Blogs</Link>
                </li>
              </ul>
            </div>
            <div className="mt-3">
              <h3 className="font-semibold text-base sm:text-xl">Details</h3>
              <ul className="mt-3 text-base">
                <li>
                  <Link href="/">Blog</Link>
                </li>
                <li>
                  <Link href="/">FAQ</Link>
                </li>
                <li>
                  <Link href="/">Support</Link>
                </li>
                <li>
                  <Link href="/">Developers</Link>
                </li>
              </ul>
            </div>
            <div className="mt-3">
              <h3 className="font-semibold text-base sm:text-xl">
                Important Notices
              </h3>
              <ul className="mt-3 text-base">
                <li>
                  <Link href="/">Terms and Conditions</Link>
                </li>
                <li>
                  <Link href="/">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/">Refund Policy</Link>
                </li>
                <li>
                  <Link href="/">Cancellation Policy</Link>
                </li>
              </ul>
            </div>
            <div className="mt-3">
              <h3 className="font-semibold text-base sm:text-xl">Contact Us</h3>
              <ul className="mt-3 text-base">
                <li>
                  <Link href="/">Address: 123 Main Street, City, Country</Link>
                </li>
                <li>
                  <Link href="/">Phone: (123) 456-7890</Link>
                </li>
                <li>
                  <Link href="/">Email: 0Owq0@example.com</Link>
                </li>
              </ul>
            </div>
          </div>
          <div id="disclaimer" className="mt-5 md:mt-3">
            <p className="text-xl text-[#E92424] text-center font-semibold">
              Disclaimer
            </p>
            <p className="text-sm font-medium md:text-base text-center">
              “We do not guarantee visa approval; final decisions rest with the
              respective embassy/immigration office.”
            </p>
          </div>
        </div>
      </div>
      <div>
        <hr className="mt-4 border border-[#E92424] opacity-60" />
        <p className="text-sm text-center mt-4 font-medium">
          Copyright © 2025 VisaHelp. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
