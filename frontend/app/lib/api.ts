import { Api } from "./client";

// Both values originate from frontend/.env:
//   VITE_API_PUBLIC_URL - read into import.meta.env automatically by Vite at build time
//   API_INTERNAL_URL    - injected into process.env at container runtime via docker-compose's env_file
const baseURL =
  typeof window === "undefined"
    ? (process.env.API_INTERNAL_URL ?? "http://api:8000")
    : (import.meta.env.VITE_API_PUBLIC_URL ?? "http://localhost:8000");

const api = new Api({
  baseURL,
  securityWorker: (token) => {
    if (token) {
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }
    return {};
  },
});

export default api;
