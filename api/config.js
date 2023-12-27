const dotenv = require("dotenv")
const path = require("path")

const env = process.env.NODE_ENV || "dev"

dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) })

const config = {
  env: env,
  uploadDir: {
    user: process.env.UPLOAD_DIR + process.env.UPLOAD_DIR_USER,
  },
  passwordGeneration: {
    length: 8,
    numbers: true,
    uppercase: false,
    excludeSimilarCharacters: true,
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS),
  },
}

module.exports = config
