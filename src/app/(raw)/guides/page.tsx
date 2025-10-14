"use client";

import { useState } from "react";
import GuideHero from "@/components/guides/GuideHero";
import GuideProcessOne from "@/components/guides/GuideProcessOne";
import SchoolAdmissionRequirements from "@/components/guides/SchoolAdmissionRequirements";
import StudentVisaApplicationProcess from "@/components/guides/StudentVisaApplicationProcess";
import { FileText, School, Plane } from "lucide-react";

type Props = {};

const page = (props: Props) => {
  const [activeTab, setActiveTab] = useState("timeline");

  const tabs = [
    {
      id: "timeline",
      label: "Application Timeline",
      icon: Plane,
    },
    {
      id: "admission",
      label: "Admission Requirements",
      icon: School,
    },
    {
      id: "visa",
      label: "Visa Process",
      icon: FileText,
    },
  ];

  return (
    <>
      <main className="bg-gradient-to-b from-white to-emerald-50/30 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <GuideHero />

          {/* Tabs Navigation */}
          <div className="px-6 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-2">
              <div className="flex flex-col sm:flex-row gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium transition-all ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md"
                          : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden text-sm">
                        {tab.label.split(" ")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="px-6 py-12">
            {activeTab === "timeline" && (
              <div className="animate-in fade-in duration-500">
                <GuideProcessOne />
              </div>
            )}

            {activeTab === "admission" && (
              <div className="animate-in fade-in duration-500">
                <SchoolAdmissionRequirements />
              </div>
            )}

            {activeTab === "visa" && (
              <div className="animate-in fade-in duration-500">
                <StudentVisaApplicationProcess />
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default page;
