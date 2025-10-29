import { redirect } from "next/navigation";

export function redirectWithMessage(path: string, msg: string): never {
  redirect(`${path}?message=${encodeURIComponent(msg)}`);
}
