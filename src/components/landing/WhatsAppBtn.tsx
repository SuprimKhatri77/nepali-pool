import { FaWhatsapp } from "react-icons/fa";

export default function WhatsappButton({ number = "9867473181", text = "Hello Everyone" }) {
  // const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  const url ="https://chat.whatsapp.com/DHoZJkUVSzr7Vmrjkjwr97"
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="z-50 inline-flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-200 hover:shadow fixed bottom-4 right-4"
    >
      <FaWhatsapp size={20} />
      <span className="hidden sm:inline">Contact Us</span>
    </a>
  );
}
