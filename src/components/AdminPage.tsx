import Link from "next/link";
import SignOutButton from "./SignOutButton";
import { Button } from "./ui/button";

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-3">
      <div>
        Who let you come here dwag? You sure don't look like an admin though!
        Whatever !!!
      </div>
      <SignOutButton />

      <Button asChild>
        <Link href="/admin/mentor-applications">Mentor Applications</Link>
      </Button>
      <Button asChild>
        <Link href="/admin/add-school">Add school</Link>
      </Button>
    </div>
  );
}
