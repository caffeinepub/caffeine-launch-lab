import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Admin from "./pages/Admin";
import GeneratorPage from "./pages/GeneratorPage";
import Landing from "./pages/Landing";
import ToolsPage from "./pages/ToolsPage";

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

const toolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tools",
  component: ToolsPage,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  adminRoute,
  generatorRoute,
  toolsRoute,
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
