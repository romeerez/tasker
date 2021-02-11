import { GraphQLClient } from 'graphql-request';
import { RequestDocument, Variables } from 'graphql-request/dist/types';
export { gql } from 'graphql-request';

const client = new GraphQLClient(process.env.DATABASE_GRAPHQL_URL, {
  headers: { 'X-Hasura-Admin-Secret': process.env.HASURA_ADMIN_SECRET },
});

export const request = <T, V = Variables>(
  document: RequestDocument,
  variables?: V,
): Promise<T> => client.request<T, V>(document, variables);
