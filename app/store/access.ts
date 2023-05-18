/*
In addition to the changes I've made in the code snippet, make sure to implement server-side
access control and authentication, as well as CSRF protection in your API routes.
If you are using `next-iron-session` or `next-auth`, follow their respective documentation
for setting up CSRF tokens and session management.

Remember that client-side security should be complemented by server-side security measures.
Always validate and sanitize user inputs on the server-side as well, and ensure you have proper
access control in place for your API routes.

By following these recommendations, you can enhance the security of your Next.js application
and reduce the chances of common web vulnerabilities.

 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import DOMPurify from "dompurify";

export interface AccessControlStore {
  accessCode: string;
  token: string;

  needCode: boolean;

  updateToken: (_: string) => void;
  updateCode: (_: string) => void;
  enabledAccessControl: () => boolean;
  isAuthorized: () => boolean;
  fetch: () => void;
}

export const ACCESS_KEY = "access-control";

let fetchState = 0; // 0 not fetch, 1 fetching, 2 done

export const useAccessStore = create<AccessControlStore>()(
  persist(
    (set, get) => ({
      token: "",
      accessCode: "",
      needCode: true,
      enabledAccessControl() {
        get().fetch();

        return get().needCode;
      },
      updateCode(code: string) {
        set((state) => ({ accessCode: DOMPurify.sanitize(code) }));
      },
      updateToken(token: string) {
        set((state) => ({ token: DOMPurify.sanitize(token) }));
      },
      isAuthorized() {
        // has token or has code or disabled access control
        return (
          !!get().token || !!get().accessCode || !get().enabledAccessControl()
        );
      },
      fetch() {
        if (fetchState > 0) return;
        fetchState = 1;
        fetch("/api/config", {
          method: "post",
          body: null,
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": localStorage.getItem("csrfToken") || "",
          },
        })
          .then((res) => res.json())
          .then((res: DangerConfig) => {
            console.log("[Config] got config from server", res);
            set(() => ({ ...res }));
          })
          .catch(() => {
            console.error("[Config] failed to fetch config");
          })
          .finally(() => {
            fetchState = 2;
          });
      },

}),
{
  name: ACCESS_KEY,
  version: 1,
    },
  ),
);
