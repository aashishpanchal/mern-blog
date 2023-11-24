import chalk from "chalk";
import config from "@/config";
import logger from "@/common/logger";
import { App } from "./app";

async function main(): Promise<void> {
  const app = await App();
  // get port and host from config
  const port: number = config.getOrThrow("port");
  const host: string = config.getOrThrow("host");
  // server start
  app.listen(port, host, () =>
    logger.log(`Server Listening on ${chalk.cyan(`http://${host}:${port}`)}`)
  );
}

main();
