import { CodegenConfig } from '@graphql-codegen/cli';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

const config: CodegenConfig = {
  schema: siteUrl + "/api/graphql",
  documents: ['app/lib/graphql/*.ts'],
  generates: {
    './app/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
        fragmentMasking: { unmaskFunctionName: "getFragmentData" }
      }
    }
  },
  ignoreNoDocuments: true,
};

export default config;