export const getFileType = (
  info: any
): "image" | "video" | "audio" | "pdf" | "file" => {
  const url = info.secure_url || "";
  const mime = info.mime_type || "";
  const format = info.format || "";
  const originalFilename = info.original_filename || "";

  if (
    format === "pdf" ||
    mime === "application/pdf" ||
    /\.pdf$/i.test(url) ||
    /\.pdf$/i.test(originalFilename)
  ) {
    return "pdf";
  }

  if (
    /\.(doc|docx|xls|xlsx|ppt|pptx|txt|csv)$/i.test(url) ||
    /\.(doc|docx|xls|xlsx|ppt|pptx|txt|csv)$/i.test(originalFilename) ||
    mime.includes("document") ||
    mime.includes("spreadsheet") ||
    mime.includes("presentation") ||
    mime.includes("text/plain")
  ) {
    return "file";
  }

  if (info.resource_type === "video") return "video";
  if (info.resource_type === "raw") return "file"; // Raw files are usually documents

  if (mime.startsWith("audio") || /\.(mp3|wav|ogg|m4a|flac)$/i.test(url)) {
    return "audio";
  }

  if (
    mime.startsWith("video") ||
    /\.(mp4|mov|avi|mkv|webm|flv|wmv|3gp)$/i.test(url)
  ) {
    return "video";
  }

  if (
    mime.startsWith("image") ||
    /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url)
  ) {
    return "image";
  }

  return "file";
};
