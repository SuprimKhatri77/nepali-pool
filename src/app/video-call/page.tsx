import { MyVideoCalls } from "@/components/video-calls/my-video-calls";
import { requireViewer } from "../../../server/lib/auth/guards";

export const metadata = {
  title: "Video calls | NepaliPool",
};

// The calls load on the client (MyVideoCalls), one status tab at a time.
export default async function VideoCallsPage() {
  const viewer = await requireViewer(["student", "mentor"]);

  return <MyVideoCalls role={viewer.status} />;
}
