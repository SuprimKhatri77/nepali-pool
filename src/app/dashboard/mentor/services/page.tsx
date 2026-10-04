import { requireApprovedMentor } from "../../../../../server/lib/auth/guards";
import ManageServices from "@/components/mentor-services/ManageServices";

export const metadata = {
  title: "My Services | NepaliPool",
};

// Services and payment details load on the client (ManageServices).
export default async function MentorServicesPage() {
  await requireApprovedMentor();

  return <ManageServices />;
}
