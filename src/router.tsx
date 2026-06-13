import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";

// Import Layout (App)
import App from "./App";

// Import Pages
import Home from "./pages/home";
import TextCaseConverter from "./pages/text/case-converter";
import DiffChecker from "./pages/text/diff-checker";
import Base64Converter from "./pages/encoders/base64";
import HashGenerator from "./pages/encoders/hash-generator";
import JwtDecoder from "./pages/encoders/jwt";

// Create root route with App as component
const rootRoute = createRootRoute({
  component: App,
});

// Create children routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const caseConverterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/case-converter",
  component: TextCaseConverter,
});

const diffCheckerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/diff-checker",
  component: DiffChecker,
});

const base64Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/base64",
  component: Base64Converter,
});

const hashGeneratorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hash-generator",
  component: HashGenerator,
});

const jwtRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/jwt",
  component: JwtDecoder,
});

// Build route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  caseConverterRoute,
  diffCheckerRoute,
  base64Route,
  hashGeneratorRoute,
  jwtRoute,
]);

// Create and export router instance
export const router = createRouter({ routeTree });

// Register router for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
