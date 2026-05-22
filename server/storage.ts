/**
 * Storage helpers — Self-hosted version
 * 
 * When BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY are set, uses the
 * remote storage proxy. Otherwise, falls back to local filesystem storage
 * under client/public/assets/uploads/.
 */

import { ENV } from './_core/env';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

type StorageConfig = { baseUrl: string; apiKey: string };

function getStorageConfig(): StorageConfig | null {
  const baseUrl = ENV.forgeApiUrl;
  const apiKey = ENV.forgeApiKey;

  if (!baseUrl || !apiKey) {
    return null; // Use local storage fallback
  }

  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}

// ─── Local Filesystem Storage ───

const UPLOAD_DIR = path.resolve(process.cwd(), 'client/public/assets/uploads');

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

function localStoragePut(
  relKey: string,
  data: Buffer | Uint8Array | string
): { key: string; url: string } {
  ensureUploadDir();
  const key = normalizeKey(relKey);
  const fileName = key.split('/').pop() ?? key;
  // Add random suffix to prevent collisions
  const ext = path.extname(fileName);
  const base = path.basename(fileName, ext);
  const suffix = crypto.randomBytes(4).toString('hex');
  const finalName = `${base}_${suffix}${ext}`;
  const filePath = path.join(UPLOAD_DIR, finalName);

  const buffer = typeof data === 'string' ? Buffer.from(data) : Buffer.from(data);
  fs.writeFileSync(filePath, buffer);

  const url = `/assets/uploads/${finalName}`;
  return { key: finalName, url };
}

function localStorageGet(relKey: string): { key: string; url: string } {
  const key = normalizeKey(relKey);
  return { key, url: `/assets/uploads/${key}` };
}

// ─── Remote Storage (S3 proxy) ───

function buildUploadUrl(baseUrl: string, relKey: string): URL {
  const url = new URL("v1/storage/upload", ensureTrailingSlash(baseUrl));
  url.searchParams.set("path", normalizeKey(relKey));
  return url;
}

async function buildDownloadUrl(
  baseUrl: string,
  relKey: string,
  apiKey: string
): Promise<string> {
  const downloadApiUrl = new URL(
    "v1/storage/downloadUrl",
    ensureTrailingSlash(baseUrl)
  );
  downloadApiUrl.searchParams.set("path", normalizeKey(relKey));
  const response = await fetch(downloadApiUrl, {
    method: "GET",
    headers: buildAuthHeaders(apiKey),
  });
  return (await response.json()).url;
}

function ensureTrailingSlash(value: string): string {
  return value.endsWith("/") ? value : `${value}/`;
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function toFormData(
  data: Buffer | Uint8Array | string,
  contentType: string,
  fileName: string
): FormData {
  const blob =
    typeof data === "string"
      ? new Blob([data], { type: contentType })
      : new Blob([data as any], { type: contentType });
  const form = new FormData();
  form.append("file", blob, fileName || "file");
  return form;
}

function buildAuthHeaders(apiKey: string): HeadersInit {
  return { Authorization: `Bearer ${apiKey}` };
}

// ─── Exported API ───

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const config = getStorageConfig();

  // Local fallback
  if (!config) {
    return localStoragePut(relKey, data);
  }

  // Remote S3 proxy
  const { baseUrl, apiKey } = config;
  const key = normalizeKey(relKey);
  const uploadUrl = buildUploadUrl(baseUrl, key);
  const formData = toFormData(data, contentType, key.split("/").pop() ?? key);
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: buildAuthHeaders(apiKey),
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(
      `Storage upload failed (${response.status} ${response.statusText}): ${message}`
    );
  }
  const url = (await response.json()).url;
  return { key, url };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const config = getStorageConfig();

  // Local fallback
  if (!config) {
    return localStorageGet(relKey);
  }

  // Remote S3 proxy
  const { baseUrl, apiKey } = config;
  const key = normalizeKey(relKey);
  return {
    key,
    url: await buildDownloadUrl(baseUrl, key, apiKey),
  };
}
