import { UserX } from "lucide-react";

export function StudentEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <UserX size={40} className="text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No Students Yet
      </h3>
      <p className="text-gray-600 text-center max-w-md mb-6">
        There are no student profiles available at the moment. Be the first to
        join the community!
      </p>
      <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
        <UserX size={18} />
        Create Your Profile
      </button>
    </div>
  );
}
