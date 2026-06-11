export const getFileIcon = (url: string) => {
  if (!url) return "attach_file";
  const extension = url.split(".").pop()?.toLowerCase() || "";
  switch (extension) {
    case "pdf":
      return "picture_as_pdf";
    case "doc":
    case "docx":
      return "description";
    case "xls":
    case "xlsx":
      return "table_chart";
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return "image";
    case "zip":
    case "rar":
      return "inventory_2";
    default:
      return "attach_file";
  }
};

export const getFileName = (url: string) => {
  if (!url) return "Xem đính kèm";
  try {
    const decodedUrl = decodeURIComponent(url);
    const parts = decodedUrl.split("/");
    const lastPart = parts[parts.length - 1];
    return lastPart.split("?")[0] || "Xem đính kèm";
  } catch {
    return "Xem đính kèm";
  }
};
