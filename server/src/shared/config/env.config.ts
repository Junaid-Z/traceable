import { cleanEnv, port, str } from "envalid";

export const env = cleanEnv(process.env, {
  POSTGRES_USER: str({ default: "postgres" }),
  POSTGRES_PASSWORD: str(),
  POSTGRES_DB: str({ default: "traceable" }),
  NODE_ENV: str({ default: "development" }),
  POSTGRES_PORT: port({ default: 5432 }),
  POSTGRES_HOST: str({ default: "postgres" }),
});
