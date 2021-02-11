const { config } = require('dotenv')
config()

module.exports = {
  schema: {
    'http://localhost:8080/v1/graphql': {
      headers: {
        "X-Hasura-Admin-Secret": process.env.HASURA_ADMIN_SECRET
      }
    }
  },
  overwrite: true,
  generates: {
    './shared/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
      ],
    },
  },
};