"use server";

import { getViewer } from "../../lib/auth/viewer";

export type NavViewer = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "student" | "mentor" | "admin" | "none" | null;
};

// What the site header needs to know about the current visitor. Only these
// fields leave the server; null means "not signed in".
export async function getNavViewer(): Promise<NavViewer | null> {
  const viewer = await getViewer();
  if (viewer.status === "anonymous" || viewer.status === "invalid") {
    return null;
  }
  const { id, name, email, image, role } = viewer.user;
  return { id, name, email, image, role };
}
