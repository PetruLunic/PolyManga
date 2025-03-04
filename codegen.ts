import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/graphql`,
  documents: ['app/lib/graphql/**/*.ts'],
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