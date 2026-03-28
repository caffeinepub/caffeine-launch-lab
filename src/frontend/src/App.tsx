import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import AboutPage from "./pages/AboutPage";
import Admin from "./pages/Admin";
import CaffeineInfoPage from "./pages/CaffeineInfoPage";
import CanvaPage from "./pages/CanvaPage";
import DatenschutzPage from "./pages/DatenschutzPage";
import ElevenLabsPage from "./pages/ElevenLabsPage";
import GeneratorPage from "./pages/GeneratorPage";
import ImpressumPage from "./pages/ImpressumPage";
import InVideoPage from "./pages/InVideoPage";
import Landing from "./pages/Landing";

function getHashPath(): string {
  const hash = window.location.hash;
  // Strip leading '#' to get the path, e.g. '#/admin' → '/admin'
  const path = hash.startsWith("#") ? hash.slice(1) : hash;
  return path || "/";
}

function useHashRouter() {
  const [path, setPath] = useState(getHashPath);

  useEffect(() => {
    const onHashChange = () => setPath(getHashPath());
    window.addEventListener("hashchange", onHashChange);
    // Also listen to popstate for back/forward navigation
    window.addEventListener("popstate", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", onHashChange);
    };
  }, []);

  return path;
}

function resolveRoute(path: string): React.ReactNode {
  // Exact and prefix matches
  if (
    path === "/admin" ||
    path.startsWith("/admin/") ||
    path.startsWith("/admin?")
  ) {
    return <Admin />;
  }
  if (path === "/generator" || path.startsWith("/generator/")) {
    return <GeneratorPage />;
  }
  if (path === "/caffeine-info" || path.startsWith("/caffeine-info/")) {
    return <CaffeineInfoPage />;
  }
  if (path === "/about" || path.startsWith("/about/")) {
    return <AboutPage />;
  }
  if (path === "/tool/canva") {
    return <CanvaPage />;
  }
  if (path === "/tool/invideo") {
    return <InVideoPage />;
  }
  if (path === "/tool/elevenlabs") {
    return <ElevenLabsPage />;
  }
  if (path === "/impressum" || path.startsWith("/impressum/")) {
    return <ImpressumPage />;
  }
  if (path === "/datenschutz" || path.startsWith("/datenschutz/")) {
    return <DatenschutzPage />;
  }
  // Default: Landing page
  return <Landing />;
}

export default function App() {
  const path = useHashRouter();
  const page = resolveRoute(path);

  return (
    <>
      {page}
      <Toaster />
    </>
  );
}
