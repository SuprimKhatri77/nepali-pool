export const getFileType = (
  info: any
): "image" | "video" | "audio" | "file" => {
  const url = info.secure_url || "";
  const mime = info.mime_type || "";
  const format = info.format || "";

  if (info.resource_type === "image") return "image";
  if (info.resource_type === "video") return "video";

  if (mime.startsWith("audio") || /\.(mp3|wav|ogg|m4a|flac)$/i.test(url)) {
    return "audio";
  }

  if (
    mime.startsWith("image") ||
    /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url)
  ) {
    return "image";
  }

  if (
    mime.startsWith("video") ||
    /\.(mp4|mov|avi|mkv|webm|flv|wmv|3gp)$/i.test(url)
  ) {
    return "video";
  }

  return "file";
};
