const path = require("path")

const env = process.env.NODE_ENV || "dev"

require("dotenv").config({ path: path.resolve(process.cwd(), `.env.${env}`) })

const connection = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
}

module.exports = {
  prod: {
    client: "pg",
    connection,
    migrations: {
      directory: "./db/migrations",
    },
    seeds: { directory: "./db/seeds" },
  },
  dev: {
    client: "pg",
    connection,
    migrations: {
      directory: "./db/migrations",
    },
    seeds: { directory: "./db/seeds" },
  },
}
