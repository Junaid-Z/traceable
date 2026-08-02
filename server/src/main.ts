import { env } from "@shared/config/env.config.js";
import { router } from "./router.js";
import { server } from "./server.js";

try {
  server.register(router);
  await server.listen({ port: env.PORT });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
