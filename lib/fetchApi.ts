const CLIENT_API_URL = process.env.NEXT_PUBLIC_API_URL;

const ALTERNATE_URLS = [
  CLIENT_API_URL,
  CLIENT_API_URL?.replace("127.0.0.1", "localhost"),
  CLIENT_API_URL?.replace("localhost", "127.0.0.1"),
  "https://127.0.0.1:8000",
  "https://localhost:8000",
  "http://127.0.0.1:8000",
  "http://localhost:8000",
].filter(Boolean) as string[];

const API_URLS = [...new Set(ALTERNATE_URLS)];

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export async function fetchBackend(path: string, options?: RequestInit) {
  const normalizedPath = normalizePath(path);
  let lastError: unknown = null;

  for (const base of API_URLS) {
    if (!base) continue;

    const url = `${base}${normalizedPath}`;
    try {
      return await fetch(url, options);
    } catch (error) {
      lastError = error;
    }
  }

  const message = `Unable to connect to backend API. Tried: ${API_URLS.join(", ")}`;
  const error = new Error(message);
  if (lastError instanceof Error) {
    error.stack = lastError.stack;
  }
  throw error;
}
