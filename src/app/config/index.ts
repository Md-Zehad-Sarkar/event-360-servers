import dotenv from "dotenv";

import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });
export default {
  node_env: process.env.NODE_ENV,
  db_url: process.env.DB_URI,
  port: process.env.PORT,
};
