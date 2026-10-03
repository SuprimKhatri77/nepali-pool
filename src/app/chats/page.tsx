import SelectChatPlaceholder from "@/components/SelectChatPlaceholder";
import { requireViewer } from "../../../server/lib/auth/guards";

const Page = async () => {
  await requireViewer(["student", "mentor"]);
  return <SelectChatPlaceholder />;
};

export default Page;
