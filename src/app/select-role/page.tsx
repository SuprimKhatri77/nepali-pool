import { requireViewer } from "../../../server/lib/auth/guards";
import SelectRolePage from "@/components/SelectRole";

export default async function SelectRole() {
  await requireViewer(["no-role"]);
  
  return <SelectRolePage />;
}
