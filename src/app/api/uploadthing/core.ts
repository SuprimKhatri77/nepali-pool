import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth as authServer } from "../../../../server/lib/auth/auth";

const f = createUploadthing();

// Uploads are only for signed-in users.
async function requireUploader(req: Request) {
  const session = await authServer.api.getSession({ headers: req.headers });
  if (!session) {
    throw new UploadThingError({ code: "FORBIDDEN", message: "Please log in to upload" });
  }
  return { userId: session.user.id };
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
    pdf: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(({ req }) => requireUploader(req))
    .onUploadComplete(async ({ metadata }) => {
      // This code RUNS ON YOUR SERVER after upload
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),

  // Payment screenshots (students) and payment QR codes (mentors).
  // Requires a signed-in user.
  paymentImageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(({ req }) => requireUploader(req))
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
