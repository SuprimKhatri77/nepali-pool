import Link from "next/link";

const exploreLinks = [
  { href: "/home", name: "Home", id: 1 },
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
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          {/* Logo & Social */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="px-2 py-2 sm:px-0 sm:py-0 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                NP
              </div>
              <span className="font-semibold text-lg text-gray-900">
                NepaliPool
              </span>
            </div>
            <div className="w-16 h-1 bg-emerald-600 rounded-full mb-4"></div>
            <p className="text-sm text-gray-600">
              Connecting dreams to reality
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Explore</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {exploreLinks.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className="hover:text-emerald-600">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Details */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Details</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {detailLinks.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className="hover:text-emerald-600">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Notices */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {legalLinks.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className="hover:text-emerald-600">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Butwal, Nepal</li>
              <li>(123) 456-7890</li>
              <li>support@nepalipool.com</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-center text-red-800">
            <span className="font-semibold">Disclaimer:</span> We do not
            guarantee visa approval; final decisions rest with the respective
            embassy/immigration office.
          </p>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-600">
            Copyright © 2025 NepaliPool. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
