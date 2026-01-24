"use server";

import { headers } from "next/headers";
import { auth } from "../auth";

type GetCurrentUserSessionType = {
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
};
export async function getCurrentUserSession(): Promise<GetCurrentUserSessionType> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return { session };
}
