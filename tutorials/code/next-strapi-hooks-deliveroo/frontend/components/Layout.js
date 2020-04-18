/* /components/Layout.js */

import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Container, Nav, NavItem } from "reactstrap";
//import HOC withAuthSync and logout method
//wrap page in withAuthSync to access token and user props
import { logout } from "../lib/auth";

const Layout = (props) => {
  const title = "Welcome to Nextjs";
  const { children, token, user } = props;
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
          crossOrigin="anonymous"
        />
        <script src="https://js.stripe.com/v3" />
      </Head>
      <header>
        <style jsx>
          {`
            a {
              color: white;
            }
            h5 {
              color: white;
              padding-top: 11px;
            }
          `}
        </style>
        <Nav className="navbar navbar-dark bg-dark">
          <NavItem>
            <Link href="/">
              <a className="navbar-brand">Home</a>
            </Link>
          </NavItem>

          <NavItem className="ml-auto">
            {token ? (
              <h5>{user}</h5>
            ) : (
              <Link href="/signup">
                <a className="nav-link"> Sign up</a>
              </Link>
            )}
          </NavItem>
          <NavItem>
            {token ? (
              <Link href="/">
                <a className="nav-link" onClick={logout}>
                  Logout
                </a>
              </Link>
            ) : (
              <Link href="/signin">
                <a className="nav-link">Sign in</a>
              </Link>
            )}
          </NavItem>
        </Nav>
      </header>
      <Container>{children}</Container>
    </div>
  );
};

export default Layout;
