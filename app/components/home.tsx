/*
In the `Home` component, the main entry point for the application:

1. `const isMobileScreen = useMobileScreen();` checks if the screen is a mobile screen using
  the custom hook `useMobileScreen`.
2. `useSwitchTheme();` applies the theme switching logic using the custom hook `useSwitchTheme`.
3. `if (!useHasHydrated()) { return <Loading />; }` checks if the component has been hydrated
  using the custom hook `useHasHydrated`. If not, it returns the `Loading` component.
4. The `Home` component then renders an `ErrorBoundary` component wrapping a `Router` component.
5. Inside the `Router`, it conditionally renders either the `MobileScreen` or `WideScreen` component
  based on the value of `isMobileScreen`.

The `MobileScreen` and `WideScreen` components are responsible for rendering the application's layout,
including the sidebar and the appropriate routes for different pages like Home, Chat, and Settings.
*/

// Imports and polyfills
"use client";
require("../polyfill");
import { useState, useEffect } from "react";
import styles from "./home.module.scss";
import BotIcon from "../icons/bot.svg";
import LoadingIcon from "../icons/three-dots.svg";
import { useChatStore } from "../store";
import { getCSSVar, useMobileScreen } from "../utils";
import { Chat } from "./chat";
import dynamic from "next/dynamic";
import { Path } from "../constant";
import { ErrorBoundary } from "./error";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { SideBar } from "./sidebar";
import { useAppConfig } from "../store/config";

// Loading component, displays a loading icon and an optional logo
export function Loading(props: { noLogo?: boolean }) {
  return (
    <div className={styles["loading-content"] + " no-dark"}>
      {!props.noLogo && <BotIcon />}
      <LoadingIcon />
    </div>
  );
}

// Dynamically import Settings component with a loading indicator
const Settings = dynamic(async () => (await import("./settings")).Settings, {
  loading: () => <Loading noLogo />,
});

// Dynamically import SideBar component with a loading indicator
const SideBar = dynamic(async () => (await import("./sidebar")).SideBar, {
  loading: () => <Loading noLogo />,
});

// Custom hook to switch the theme of the application
export function useSwitchTheme() {
  const config = useAppConfig();

  useEffect(() => {
    document.body.classList.remove("light");
    document.body.classList.remove("dark");

    if (config.theme === "dark") {
      document.body.classList.add("dark");
    } else if (config.theme === "light") {
      document.body.classList.add("light");
    }

    const metaDescriptionDark = document.querySelector(
      'meta[name="theme-color"][media]',
    );
    const metaDescriptionLight = document.querySelector(
      'meta[name="theme-color"]:not([media])',
    );

    if (config.theme === "auto") {
      metaDescriptionDark?.setAttribute("content", "#151515");
      metaDescriptionLight?.setAttribute("content", "#fafafa");
    } else {
      const themeColor = getCSSVar("--themeColor");
      metaDescriptionDark?.setAttribute("content", themeColor);
      metaDescriptionLight?.setAttribute("content", themeColor);
    }
  }, [config.theme]);
}

// Custom hook to check if the component has been hydrated (rendered) on the client-side
const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

// WideScreen component for non-mobile screens, renders SideBar and the Routes
function WideScreen() {
  const config = useAppConfig();

  return (
    <div
      className={`${
        config.tightBorder ? styles["tight-container"] : styles.container
      }`}
    >
      <SideBar />
      <div className={styles["window-content"]}>
        <Routes>
          <Route path={Path.Home} element={<Chat />} />
          <Route path={Path.Chat} element={<Chat />} />
          <Route path={Path.Settings} element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

// MobileScreen component for mobile screens, renders SideBar and the Routes
function MobileScreen() {
  const location = useLocation();
  const isHome = location.pathname === Path.Home;

  return (
    <div className={styles.container}>
      <SideBar className={isHome ? styles["sidebar-show"] : ""} />
      <div className={styles["window-content"]}>
        <Routes>
          <Route path={Path.Home} element={null} />
          <Route path={Path.Chat} element={<Chat />} />
          <Route path={Path.Settings} element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

// Home component, main entry point for the application
export function Home() {
  const isMobileScreen = useMobileScreen();
  useSwitchTheme();

  // Clear local and session storage every time the app loads
  /*
  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  }, []);
  */

  // Display the Loading component until the app is hydrated
  if (!useHasHydrated()) {
    return <Loading />;
  }

  // Render the appropriate layout depending on
  // the screen size (mobile or widescreen)
  return (
    <ErrorBoundary>
      <Router>{isMobileScreen ? <MobileScreen /> : <WideScreen />}</Router>
    </ErrorBoundary>
  );
}
