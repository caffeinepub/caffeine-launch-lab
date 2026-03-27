import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Admin from "./pages/Admin";
import CaffeineInfoPage from "./pages/CaffeineInfoPage";
import GeneratorPage from "./pages/GeneratorPage";
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

const routeTree = rootRoute.addChildren([
  landingRoute,
  adminRoute,
  generatorRoute,
  caffeineInfoRoute,
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
