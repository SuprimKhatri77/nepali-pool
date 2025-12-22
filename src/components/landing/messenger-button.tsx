"use client";

export function MessengerIcon() {
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <a
        href="https://m.me/ch/AbaTeAj-1emyPCEe/?send_source=cm%3Acopy_invite_link"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-400 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 ease-in-out active:scale-95 animate-pulse"
        aria-label="Join our Messenger group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="w-8 h-8"
        >
          <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.912 1.45 5.504 3.717 7.197V22l3.482-1.913c.93.258 1.907.396 2.801.396 5.523 0 10-4.145 10-9.243C22 6.145 17.523 2 12 2zm1.003 12.374l-2.559-2.73-4.994 2.73 5.492-5.835 2.622 2.73 4.931-2.73-5.492 5.835z" />
        </svg>
      </a>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
          }
        }
      `}</style>
    </div>
  );
}
