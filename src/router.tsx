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
import CodeFormatter from "./pages/formatter";
import UuidGenerator from "./pages/uuid";
import UrlEncoder from "./pages/encoders/url-encoder";
import RegexTester from "./pages/developer/regex-tester";
import TimestampConverter from "./pages/developer/timestamp";
import RequestBuilder from "./pages/generators/request-builder";

// Create root route with App as component
const rootRoute = createRootRoute({
  component: App,
});

// Create children routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
  staticData: { title: "Trang chủ" },
});

const caseConverterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/case-converter",
  component: TextCaseConverter,
  staticData: { title: "Chuyển đổi kiểu chữ" },
});

const diffCheckerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/diff-checker",
  component: DiffChecker,
  staticData: { title: "Diff Checker" },
});

const base64Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/base64",
  component: Base64Converter,
  staticData: { title: "Base64 Encoder" },
});

const hashGeneratorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hash-generator",
  component: HashGenerator,
  staticData: { title: "Hash Generator" },
});

const jwtRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/jwt",
  component: JwtDecoder,
  staticData: { title: "JWT Encoder/Decoder" },
});

const codeFormatterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/code-formatter",
  component: CodeFormatter,
  staticData: { title: "Code Formatter" },
});

const uuidRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/uuid-generator",
  component: UuidGenerator,
  staticData: { title: "UUID Generator" },
});

const urlEncoderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/url-encoder",
  component: UrlEncoder,
  staticData: { title: "URL Encoder/Decoder" },
});

const regexTesterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/regex-tester",
  component: RegexTester,
  staticData: { title: "Kiểm tra Regex" },
});

const timestampRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/timestamp-converter",
  component: TimestampConverter,
  staticData: { title: "Unix Timestamp" },
});

const requestBuilderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/request-builder",
  component: RequestBuilder,
  staticData: { title: "Request Builder" },
});

// Build route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  caseConverterRoute,
  diffCheckerRoute,
  base64Route,
  hashGeneratorRoute,
  jwtRoute,
  codeFormatterRoute,
  uuidRoute,
  urlEncoderRoute,
  regexTesterRoute,
  timestampRoute,
  requestBuilderRoute,
]);

// Create and export router instance
export const router = createRouter({ routeTree });

// Register router for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
  interface StaticDataRouteOption {
    title?: string;
  }
}
