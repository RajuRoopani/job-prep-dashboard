const SESSION_KEY = "job_prep_chat_session_id";

export function getOrCreateSessionId(): string {
  // Guard: localStorage is undefined in SSR/Node environments
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}
