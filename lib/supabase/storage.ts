import { createClient } from "./client";

const BUCKET_NAME = "documents";

export async function uploadFile(
  file: File,
  fileName?: string
): Promise<string> {
  const supabase = createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Generate unique file name if not provided
  const fileExt = file.name.split('.').pop();
  const filePath = fileName 
    ? `${user.id}/${fileName}.${fileExt}`
    : `${user.id}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  // Upload file to storage
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw error;

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

  return publicUrl;
}

export async function deleteFile(fileUrl: string): Promise<void> {
  const supabase = createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Extract the file path from the public URL
  // URL format: https://[project].supabase.co/storage/v1/object/public/documents/[path]
  const urlParts = fileUrl.split('/storage/v1/object/public/');
  if (urlParts.length < 2) {
    throw new Error("Invalid file URL");
  }
  
  const pathPart = urlParts[1];
  const filePath = pathPart.replace(`${BUCKET_NAME}/`, '');

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) throw error;
}

export async function downloadFile(fileUrl: string): Promise<Blob> {
  const supabase = createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Extract the file path from the public URL
  const urlParts = fileUrl.split('/storage/v1/object/public/');
  if (urlParts.length < 2) {
    throw new Error("Invalid file URL");
  }
  
  const pathPart = urlParts[1];
  const filePath = pathPart.replace(`${BUCKET_NAME}/`, '');

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .download(filePath);

  if (error) throw error;
  if (!data) throw new Error("File not found");

  return data;
}

