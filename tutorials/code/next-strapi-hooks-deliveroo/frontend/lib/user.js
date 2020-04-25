import { useState, useEffect } from "react";
import fetch from "isomorphic-unfetch";
import Cookie from "js-cookie";

export async function fetchUser(cookie = "") {
  if (typeof window !== "undefined" && window.__user) {
    return window.__user;
  }

  // get token
  const token = Cookie.get("token");
  // make call to /users/me to validate and retrieve user object
  const res = await fetch(
    "http://localhost:1337/users/me",
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {}
  );

  // if response fails, logout user by deleting the cookie
  if (!res.ok) {
    Cookie.remove("token");
    return null;
  }

  const json = await res.json();

  // if in browser, store user object as __user on the window object for reference
  // this will only persist on the page and be cleared on tab close/refresh
  if (typeof window !== "undefined") {
    window.__user = json;
  }
  return json;
}

export function useFetchUser({ required } = {}) {
  // get token from cookies
  const token = Cookie.get("token");
  const [loading, setLoading] = useState(
    () => !(typeof window !== "undefined" && token)
  );
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return window.__user || null;
  });

  useEffect(
    () => {
      if (!loading && user) {
        return;
      }
      setLoading(true);
      let isMounted = true;

      fetchUser().then((user) => {
        // Only set the user if the component is still mounted
        if (isMounted) {
          // When the user is not logged in but login is required
          if (required && !user) {
            // window.location.href = "/login";
            return;
          }
          setUser(user);
          setLoading(false);
        }
      });

      return () => {
        isMounted = false;
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  );

  return { user, loading };
}
