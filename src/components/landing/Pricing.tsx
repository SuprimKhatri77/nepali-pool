export default function Pricing() {
  return (
    <section
      id="pricing"
      className="bg-white rounded-md text-black max-w-[90%] w-full px-8 shadow-md mx-auto min-h-screen my-8 py-8 "
    >
      <h1 className="text-4xl font-medium text-center">
        Pricing
        <span className="text-transparent bg-gradient-to-b from-red-600 to-red-700 bg-clip-text font-bold">
          {" "}
          रु
        </span>
      </h1>
      <div
        id="priceCardContainer"
        className="flex flex-wrap gap-16 text-white justify-center items-center mt-8 "
      >
        <div
          id="freeCard"
          className="shadow-[8px_6px_12px_rgba(0,0,0,0.3)]  relative rounded-[8px] w-[315px] p-6 h-[500px] bg-gradient-to-b from-[#A800B7]  to-[#2F0D68] from-0% to-100%"
        >
          <h4 className="text-center font-medium text-2xl">Free Access</h4>
          <div id="price" className="flex relative items-center justify-center">
            <p className="text-center text-5xl font-bold mt-4">
              $0/
              <sub className="text-center text-xl font-medium">month</sub>
            </p>
          </div>
          <ul className="mt-10 list-disc flex flex-col gap-2 justify-center ml-8">
            <li>Access to all features</li>
            <li>Unlimited downloads</li>
            <li>Priority support</li>
            <li>Ad-free experience</li>
            <li>Personalized recommendations</li>
          </ul>
          <div
            id="butonContainer"
            className="h-18 w-full absolute bottom-0 left-0 bg-white stroke-black stroke-2 flex justify-center items-center border-black border-solid border-1 border-t-0"
          >
            <button className="bg-black text-white cursor-pointer py-2 w-1/2 rounded-[8px]">
              {" "}
              Start for free
            </button>
          </div>
        </div>
        <div
          id="premiumCard"
          className="shadow-[8px_6px_12px_rgba(0,0,0,0.3)] relative rounded-[8px] w-[361px]  p-6 h-[585px] bg-gradient-to-b from-[#FF4053]  to-[#260f55] from-0% to-100%"
        >
          <h4 className="text-center font-medium text-2xl">
            Mentor Guidance Pack
          </h4>
          <div id="price" className="flex items-center justify-center">
            <p className="text-center text-5xl font-bold mt-4">
              $0/
              <sub className="text-center text-xl font-medium">month</sub>
            </p>
          </div>
          <ul className="mt-10 list-disc flex flex-col gap-2 justify-center ml-8">
            <li>Access to all features</li>
            <li>Priority support</li>
            <li>Ad-free experience</li>
            <li>Personalized recommendations</li>
            <li>Access to all features</li>
            <li>Unlimited downloads</li>
          </ul>
          <div
            id="butonContainer"
            className="h-18 w-full absolute bottom-0 left-0 bg-white stroke-black stroke-2 flex justify-center items-center border-black border-solid border-1 border-t-0"
          >
            <button className="bg-black text-white cursor-pointer py-2 w-1/2 rounded-[8px]">
              {" "}
              Get Started
            </button>
          </div>
        </div>
        <div
          id="callCard"
          className="shadow-[8px_6px_12px_rgba(0,0,0,0.3)] relative rounded-[8px] w-[315px]  p-6 h-[500px] bg-gradient-to-b from-[#A800B7]  to-[#2F0D68] from-0% to-100%"
        >
          <h4 className="text-center font-medium text-2xl">Make A Call</h4>
          <div id="price" className="flex items-center justify-center">
            <p className="text-center text-5xl font-bold mt-4">
              $0/
              <sub className="text-center text-xl font-medium">month</sub>
            </p>
          </div>
          <ul className="mt-10 list-disc flex flex-col gap-2 justify-center ml-8">
            <li>Access to all features</li>
            <li>Unlimited downloads</li>
            <li>Priority support</li>
            <li>Ad-free experience</li>
            <li>Personalized recommendations</li>
          </ul>
          <div
            id="butonContainer"
            className="h-18 w-full absolute bottom-0 left-0 bg-white stroke-black stroke-2 flex justify-center items-center border-black border-solid border-1 border-t-0"
          >
            <button className="bg-black text-white cursor-pointer py-2 w-1/2 rounded-[8px]">
              {" "}
              Make a Call
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
