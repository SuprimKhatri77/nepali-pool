// UploadThing app id: UPLOADTHING_APP_ID if set, otherwise read from
// UPLOADTHING_TOKEN (base64 JSON with an `appId` field), which is the only env
// var UploadThing itself requires.
function getUploadThingAppId(): string | null {
  if (process.env.UPLOADTHING_APP_ID) return process.env.UPLOADTHING_APP_ID;
  const token = process.env.UPLOADTHING_TOKEN;
  if (!token) return null;
  try {
    const { appId } = JSON.parse(Buffer.from(token, "base64").toString("utf8"));
    return typeof appId === "string" ? appId : null;
  } catch {
    return null;
  }
}

// Only accept files hosted on this app's UploadThing storage, so users can't
// point payment proofs / QR codes at arbitrary external URLs.
export function isOwnUploadUrl(value: string): boolean {
  const appId = getUploadThingAppId();
  if (!appId) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === `${appId}.ufs.sh`;
  } catch {
    return false;
  }
}
