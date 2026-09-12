import { supabase } from "../lib/supabase";

// ======================================================
// STORAGE BUCKETS
// ======================================================

const IMAGE_BUCKET = "scheme-images";
const FILE_BUCKET = "scheme-files";

// ======================================================
// HELPERS
// ======================================================

function createSafeFileName(fileName = "file") {
  const extension = fileName.includes(".")
    ? fileName.split(".").pop()
    : "";

  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const uniqueId = `${Date.now()}-${crypto.randomUUID()}`;

  return extension
    ? `${baseName || "file"}-${uniqueId}.${extension.toLowerCase()}`
    : `${baseName || "file"}-${uniqueId}`;
}

function validateFile(file) {
  if (!file) {
    throw new Error("No file selected.");
  }

  if (!(file instanceof File)) {
    throw new Error("Invalid file.");
  }
}

function validateImage(file) {
  validateFile(file);

  if (!file.type.startsWith("image/")) {
    throw new Error("Please select a valid image.");
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error(
      "Image size must be less than 5 MB."
    );
  }
}

function validateDocument(file) {
  validateFile(file);

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Only PDF, Word, Excel and CSV files are allowed."
    );
  }

  const maxSize = 10 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error(
      "File size must be less than 10 MB."
    );
  }
}

// ======================================================
// GENERIC UPLOAD
// ======================================================

async function uploadToBucket({
  bucket,
  folder,
  file,
}) {
  validateFile(file);

  const fileName = createSafeFileName(file.name);

  const filePath = folder
    ? `${folder}/${fileName}`
    : fileName;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error(
      `Upload error (${bucket}):`,
      error
    );

    throw new Error(
      error.message || "File upload failed."
    );
  }

  const { data: publicUrlData } =
    supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

  if (!publicUrlData?.publicUrl) {
    throw new Error(
      "Unable to generate public file URL."
    );
  }

  return {
    bucket,
    path: filePath,
    url: publicUrlData.publicUrl,
  };
}

// ======================================================
// UPLOAD SCHEME LOGO
// ======================================================

export async function uploadSchemeLogo(file) {
  if (!file) return null;

  validateImage(file);

  return uploadToBucket({
    bucket: IMAGE_BUCKET,
    folder: "logos",
    file,
  });
}

// ======================================================
// UPLOAD SCHEME BANNER
// ======================================================

export async function uploadSchemeBanner(file) {
  if (!file) return null;

  validateImage(file);

  return uploadToBucket({
    bucket: IMAGE_BUCKET,
    folder: "banners",
    file,
  });
}

// ======================================================
// UPLOAD GUIDELINE FILE
// ======================================================

export async function uploadGuidelineFile(file) {
  if (!file) return null;

  validateDocument(file);

  return uploadToBucket({
    bucket: FILE_BUCKET,
    folder: "guidelines",
    file,
  });
}

// ======================================================
// GENERIC SCHEME IMAGE UPLOAD
// ======================================================

export async function uploadSchemeImage(
  file,
  folder = "images"
) {
  if (!file) return null;

  validateImage(file);

  return uploadToBucket({
    bucket: IMAGE_BUCKET,
    folder,
    file,
  });
}

// ======================================================
// GENERIC SCHEME FILE UPLOAD
// ======================================================

export async function uploadSchemeFile(
  file,
  folder = "documents"
) {
  if (!file) return null;

  validateDocument(file);

  return uploadToBucket({
    bucket: FILE_BUCKET,
    folder,
    file,
  });
}

// ======================================================
// DELETE STORAGE FILE
// ======================================================

export async function deleteStorageFile(
  bucket,
  path
) {
  if (!bucket || !path) {
    return;
  }

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    console.error(
      "Storage delete error:",
      error
    );

    throw new Error(
      error.message ||
        "Unable to delete file."
    );
  }

  return true;
}