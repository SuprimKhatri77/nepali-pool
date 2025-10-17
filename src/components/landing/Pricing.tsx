export default function Pricing() {
  const plans = [
    {
      name: "Free Access",
      price: "रु0",
      features: [
        "Access to all features",
        "Unlimited downloads",
        "Priority support",
        "Ad-free experience",
        "Personalized recommendations",
      ],
      buttonText: "Start for free",
      highlighted: false,
    },
    {
      name: "Mentor Guidance Pack",
      price: "रु500",
      features: [
        "Access to all features",
        "Priority support",
        "Ad-free experience",
        "Personalized recommendations",
        "1-on-1 mentor sessions",
        "Application review",
      ],
      buttonText: "Get Started",
      highlighted: true,
    },
    {
      name: "Make A Call",
      price: "रु200",
      features: [
        "Access to all features",
        "Unlimited downloads",
        "Priority support",
        "Ad-free experience",
        "Direct mentor call",
      ],
      buttonText: "Make a Call",
      highlighted: false,
    },
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-3">
          Pricing <span className="text-emerald-600">रु</span>
        </h2>
        <div className="w-20 h-1 bg-emerald-600 mx-auto rounded-full mb-12"></div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl overflow-hidden border-2 ${
                plan.highlighted
                  ? "border-emerald-600 shadow-xl scale-105"
                  : "border-gray-200 shadow-sm"
              } transition-all hover:shadow-lg`}
            >
              <div
                className={`p-8 ${plan.highlighted ? "bg-gradient-to-br from-emerald-50 to-emerald-100" : ""}`}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.highlighted
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-gray-900 hover:bg-gray-800 text-white"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
