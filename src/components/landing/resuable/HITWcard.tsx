"use client"
type Props = { img: string; Header: string; Content: string; step: number };
import { motion} from "framer-motion"


export default function HowItWorksCard({  Header, Content, step }: Props) {
  return (
    <motion.div whileHover={{scale:1.1}} transition={{duration: 0.5}} className="relative group">
      <div className="bg-white border border-emerald-900 rounded-xl p-6 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 max-w-xs">
        <div className="w-12 h-12 text-white   rounded-lg flex items-center justify-center mb-4  bg-emerald-600/30 size-12">
          <span className=" font-bold text-lg">{step}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{Header}</h3>
        <p className="text-sm font-medium   leading-loose">{Content}</p>
      </div>
    </motion.div>
  );
}
