"use server";

import { revalidatePath } from "next/cache";
import { triggerImportOnBackend } from "@/lib/api";

export async function triggerImport(formData: FormData) {
  const feedUrl = formData.get("feedUrl");
  const value = typeof feedUrl === "string" && feedUrl.trim() !== ""
    ? feedUrl.trim()
    : undefined;

  await triggerImportOnBackend(value);

  // revalidate import list
  revalidatePath("/imports");
}
