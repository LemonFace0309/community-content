/* /lib/auth.js */

import { useEffect, useContext } from "react";
import Router from "next/router";
import Cookie from "js-cookie";
import axios from "axios";

const API_URL = process.env.API_URL || "http://localhost:1337";

//register a new user
export const registerUser = (username, email, password) => {
  //prevent function from being ran on the server
  if (!process.browser) {
    return;
  }
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/auth/local/register`, { username, email, password })
      .then((res) => {
        //set token response from Strapi for server validation
        Cookie.set("token", res.data.jwt);

        //resolve the promise to set loading to false in SignUp form
        resolve(res);
        //redirect back to home page for restaurance selection
        Router.push("/");
      })
      .catch((error) => {
        //reject the promise and pass the error object back to the form
        reject(error);
      });
  });
};

export const login = (identifier, password) => {
  //prevent function from being ran on the server
  if (!process.browser) {
    return;
  }

  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/auth/local/`, { identifier, password })
      .then((res) => {
        //set token response from Strapi for server validation
        Cookie.set("token", res.data.jwt);

        //resolve the promise to set loading to false in SignUp form
        resolve(res);
        //redirect back to home page for restaurance selection
        Router.push("/");
      })
      .catch((error) => {
        console.log({ error });
        //reject the promise and pass the error object back to the form
        reject(error);
      });
  });
};
//use this in your component pages to authenticate users
//currently this function is being utilized in the HOC withAuthSync
export const auth = (ctx) => {
  const { token } = cookies(ctx);
  /*
   * If `ctx.req` is available it means we are on the server.
   * Additionally if there's no token it means the user is not logged in.
   */
  if (ctx.req && !token) {
    ctx.res.writeHead(302, { Location: "/login" });
    ctx.res.end();
  }

  // We already checked for server. This should only happen on client.
  if (!token) {
    Router.push("/login");
  }

  return token;
};

export const logout = () => {
  //remove token and user cookie
  Cookie.remove("token");
  delete window.__user;
  // sync logout between multiple windows
  window.localStorage.setItem("logout", Date.now());
  //redirect to the home page
  Router.push("/");
};

//Higher Order Component to wrap our pages and check authentication
export const withAuthSync = (Component) => {
  const Wrapper = (props) => {
    const syncLogout = (event) => {
      if (event.key === "logout") {
        console.log("logged out from storage!");
        Router.push("/login");
      }
    };

    useEffect(() => {
      window.addEventListener("storage", syncLogout);

      return () => {
        window.removeEventListener("storage", syncLogout);
        window.localStorage.removeItem("logout");
      };
    }, []);

    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    Wrapper.getInitialProps = Component.getInitialProps;
  }

  return Wrapper;
};
