"use client";
import { useState } from "react";
import Image from "next/image";
import { CheckCircle, XCircle, X } from "lucide-react";

export default function ApplicationProfile({ mentorProfileRecordWithUser }: any) {
  const mentor = mentorProfileRecordWithUser;

  const [showImageModal, setShowImageModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showCitizenshipModal, setShowCitizenshipModal] = useState(false);

  const statusColors: Record<string, string> = {
    accepted: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-8">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-2xl overflow-hidden border">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 flex items-center gap-6">
          <Image
            src={mentor.imageUrl}
            alt={mentor.user?.name}
            width={200}
            height={200}
            className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-md cursor-pointer hover:scale-105 transition"
            onClick={() => setShowImageModal(true)}
          />
          <div>
            <h1 className="text-3xl font-bold text-white">{mentor.user?.name}</h1>
            <p className="text-indigo-100">{mentor.bio}</p>
            <span
              className={`inline-block mt-3 px-3 py-1 text-sm font-medium rounded-full shadow ${
                statusColors[mentor.verifiedStatus] || statusColors.pending
              }`}
            >
              {mentor.verifiedStatus.charAt(0).toUpperCase() + mentor.verifiedStatus.slice(1)}
            </span>
          </div>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-2 gap-6 p-6 text-sm">
          <DetailItem label="📧 Email" value={mentor.user?.email} />
          <DetailItem label="📞 Phone" value={mentor.phoneNumber} />
          <DetailItem label="🌍 Location" value={`${mentor.city}, ${mentor.country} (${mentor.zipCode})`} />
          <DetailItem label="🆔 Nationality" value={mentor.nationality} />
          <DetailItem label="📅 Applied On" value={new Date(mentor.createdAt).toLocaleDateString()} />
          <DetailItem label="👤 Sex" value={mentor.sex} />
        </div>

        {/* DOCUMENT BUTTONS */}
        <div className="border-t bg-gray-50 p-6 flex flex-wrap gap-4">
          <button
            onClick={() => setShowResumeModal(true)}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow"
          >
            📄 View Resume
          </button>

          <button
            onClick={() => setShowCitizenshipModal(true)}
            className="px-5 py-2 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-800 transition shadow"
          >
            🪪 View Citizenship
          </button>
        </div>

        {/* ACTION BUTTONS */}
        <div className="border-t bg-white p-6 flex justify-end gap-4">
          <button className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition shadow">
            <XCircle size={20} /> Reject
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition shadow">
            <CheckCircle size={20} /> Accept
          </button>
        </div>
      </div>

      {/* PROFILE IMAGE MODAL */}
      {showImageModal && (
        <Modal onClose={() => setShowImageModal(false)}>
          <Image
            src={mentor.imageUrl}
            alt={mentor.user?.name}
            width={500}
            height={500}
            className="rounded-lg max-w-[600px] w-full object-contain"
          />
        </Modal>
      )}

      {/* RESUME MODAL (PDF) */}
      {showResumeModal && (
        <Modal onClose={() => setShowResumeModal(false)}>
          <Image
            src={mentor.resume}
            width={1200}
            height={1200}
            alt="Resume"
            className="w-full  rounded-lg overflow-y-scroll"
          />
        </Modal>
      )}

      {/* CITIZENSHIP MODAL (IMAGE) */}
      {showCitizenshipModal && (
        <Modal onClose={() => setShowCitizenshipModal(false)}>
          <Image
            src={mentor.citizenshipPhotoUrl}
            alt="Citizenship"
            width={1200}
            height={1200}
            className="rounded-lg w-full object-contain"
          />
        </Modal>
      )}
    </div>
  );
}

/* ✅ REUSABLE COMPONENTS */
function DetailItem({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-gray-500 mb-1 font-medium">{label}</p>
      <p className="font-semibold text-gray-800 break-all">{value}</p>
    </div>
  );
}

export function Modal({ children, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="relative  rounded-lg p-4 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}
