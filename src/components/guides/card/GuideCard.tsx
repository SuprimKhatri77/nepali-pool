import { CheckCircle2 } from "lucide-react";

interface GuideParaCardProps {
  step: number;
  title: string;
  description: string;
  isLast?: boolean;
  ul?: string[];
}

export default function GuideParaCard({
  step,
  title,
  description,
  isLast = false,
  ul = [],
}: GuideParaCardProps) {
  return (
    <div className="relative">
      <div className="flex gap-6 group">
        {/* Step indicator */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg group-hover:scale-110 transition-transform">
            {isLast ? <CheckCircle2 className="w-6 h-6" /> : step}
          </div>
          {!isLast && (
            <div className="w-0.5 h-full bg-gradient-to-b from-emerald-300 to-emerald-100 mt-2" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 pb-12">
          <div className="bg-white rounded-xl border border-emerald-100 p-6 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              {title}
            </h3>
            {description && (
              <p className="text-gray-600 leading-relaxed">{description}</p>
            )}
            {ul.length > 0 && (
              <ul className="mt-4 space-y-2">
                {ul.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-gray-600"
                  >
                    <span className="text-emerald-500 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
