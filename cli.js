const [,, ...args] = process.argv
const { config } = require('dotenv')
config()

const action = args[0]

const hasuraDockerName = 'tasker-hasura'

if (action === 'generate-schema') {
  const {spawn} = require("child_process")
  const fs = require('fs')

  fs.mkdir('shared', (err) => {
    if (err && err.code !== 'EEXIST') throw err

    // Save database schema to shared/db-schema.graphql
    const gq = spawn("gq", [process.env.DATABASE_GRAPHQL_URL, '--introspect', '-H', `X-Hasura-Admin-Secret:${process.env.HASURA_ADMIN_SECRET}`])
    gq.stdout.pipe(fs.createWriteStream('shared/db-schema.graphql', {flags: 'w'}))
    gq.stderr.pipe(process.stdout)

    // Save database schema types to shared/db-graphql.ts
    const graphqlCodegen = spawn('graphql-codegen', ['--config', 'codegen.js'])
    graphqlCodegen.stdout.pipe(process.stdout)
    graphqlCodegen.stderr.pipe(process.stderr)

    // Merge .graphql files of server into shared/server-schema.graphql
    const path = require('path');
    const { loadFilesSync } = require('@graphql-tools/load-files');
    const { mergeTypeDefs } = require('@graphql-tools/merge');
    const { print } = require('graphql');

    const typesArray = loadFilesSync(path.join(__dirname, 'server', 'src'), { extensions: ['graphql'] });

    const typeDefs = mergeTypeDefs(typesArray)
    const printedTypeDefs = print(typeDefs)
    fs.writeFileSync(path.join('shared', 'server-schema.graphql'), printedTypeDefs)
  })
} else if (action === 'start-db') {
  const {spawn} = require("child_process")
  const os = require('os')
  const type = os.type().toLowerCase()
  let netOrPort = type === 'linux' ? '--net=host' : '-p 8080:8080'

  const docker = spawn('docker', [
    'run', '-d', `--name=${hasuraDockerName}`, netOrPort,
    '-e', `HASURA_GRAPHQL_DATABASE_URL=${process.env.DATABASE_URL}`,
    '-e', 'HASURA_GRAPHQL_ENABLE_CONSOLE=false',
    '-e', 'HASURA_GRAPHQL_DEV_MODE=true',
    '-e', `HASURA_GRAPHQL_ADMIN_SECRET=${process.env.HASURA_ADMIN_SECRET}`,
    '-e', JSON.stringify(`HASURA_GRAPHQL_JWT_SECRET='{"type": "HS256", "key": "${process.env.JWT_SECRET}"}'`),
    'hasura/graphql-engine:v1.3.3'
  ])

  docker.stdout.pipe(process.stdout)
  docker.stderr.pipe(process.stderr)
} else if (action === 'stop-db') {
  const {spawn} = require("child_process")

  const docker = spawn('docker', ['stop', hasuraDockerName])
  docker.stdout.pipe(process.stdout)
  docker.stderr.pipe(process.stderr)
  docker.on('exit', () => {
    const docker = spawn('docker', ['rm', hasuraDockerName])
    docker.stdout.pipe(process.stdout)
    docker.stderr.pipe(process.stderr)
  })
} else {
  throw new Error(`Unknown command ${action}`)
}
