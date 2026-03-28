import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import AboutPage from "./pages/AboutPage";
import Admin from "./pages/Admin";
import CaffeineInfoPage from "./pages/CaffeineInfoPage";
import CanvaPage from "./pages/CanvaPage";
import ElevenLabsPage from "./pages/ElevenLabsPage";
import GeneratorPage from "./pages/GeneratorPage";
import InVideoPage from "./pages/InVideoPage";
import Landing from "./pages/Landing";

const rootRoute = createRootRoute();

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Landing,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: Admin,
});

const generatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/generator",
  component: GeneratorPage,
});

const caffeineInfoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/caffeine-info",
  component: CaffeineInfoPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const canvaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tool/canva",
  component: CanvaPage,
});

const inVideoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tool/invideo",
  component: InVideoPage,
});

const elevenLabsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tool/elevenlabs",
  component: ElevenLabsPage,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  adminRoute,
  generatorRoute,
  caffeineInfoRoute,
  aboutRoute,
  canvaRoute,
  inVideoRoute,
  elevenLabsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
