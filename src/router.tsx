import { createRootRoute, createRoute, createRouter, lazyRouteComponent } from "@tanstack/react-router";

// Import Layout (App)
import App from "./App";

// Import Pages (Keep Home statically imported for fast first paint)
import Home from "./pages/home";

// Lazy load tools
const TextCaseConverter = lazyRouteComponent(() => import("./pages/text/case-converter"));
const DiffChecker = lazyRouteComponent(() => import("./pages/text/diff-checker"));
const Base64Converter = lazyRouteComponent(() => import("./pages/encoders/base64"));
const HashGenerator = lazyRouteComponent(() => import("./pages/encoders/hash-generator"));
const JwtDecoder = lazyRouteComponent(() => import("./pages/encoders/jwt"));
const CodeFormatter = lazyRouteComponent(() => import("./pages/formatter"));
const UuidGenerator = lazyRouteComponent(() => import("./pages/uuid"));
const UrlEncoder = lazyRouteComponent(() => import("./pages/encoders/url-encoder"));
const RegexTester = lazyRouteComponent(() => import("./pages/developer/regex-tester"));
const TimestampConverter = lazyRouteComponent(() => import("./pages/developer/timestamp"));
const RequestBuilder = lazyRouteComponent(() => import("./pages/generators/request-builder"));
const ApiTester = lazyRouteComponent(() => import("./pages/developer/api-tester"));
const JsonQueryConverter = lazyRouteComponent(() => import("./pages/developer/json-query"));

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

const apiTesterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/api-tester",
  component: ApiTester,
  staticData: { title: "Postboy" },
});

const jsonQueryConverterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/json-query-converter",
  component: JsonQueryConverter,
  staticData: { title: "JSON ↔ Query String" },
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
  apiTesterRoute,
  jsonQueryConverterRoute,
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
