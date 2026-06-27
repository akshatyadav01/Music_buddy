import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      target: "./openapi.yaml",
    },
    output: {
      mode: "single",
      target: "../../lib/api-client-react/src/generated/api.ts",
      schemas: "../../lib/api-client-react/src/generated",
      client: "react-query",
      httpClient: "fetch",
      override: {
        mutator: {
          path: "../../lib/api-client-react/src/custom-fetch.ts",
          name: "customFetch",
        },
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
  },
  apiZod: {
    input: {
      target: "./openapi.yaml",
    },
    output: {
      mode: "single",
      target: "../../lib/api-zod/src/generated/api.ts",
      client: "zod",
    },
  },
});
