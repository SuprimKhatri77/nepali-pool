export default function SubscribeNewsLetter() {
  return (
    <section className="py-12 px-6">
      <div className="max-w-5xl mx-auto bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 md:p-12 shadow-lg">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Subscribe to our newsletter
            </h2>
            <p className="text-emerald-100">
              Subscribe to our newsletter and unlock a world of exclusive
              benefits. Be the first to know about our latest products, special
              promotions, and exciting updates.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-2 border-white/20 bg-white/10 text-white placeholder:text-white/70 focus:outline-none focus:border-white/40"
            />
            <button className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
