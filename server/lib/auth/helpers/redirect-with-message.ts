import { redirect } from "next/navigation";

export function redirectWithMessage(path: string, msg: string) {
  redirect(`${path}?message=${encodeURIComponent(msg)}`);
}
