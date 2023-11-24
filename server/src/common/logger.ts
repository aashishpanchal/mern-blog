import config from "@/config";
import { Logger } from "@/lib/logger";

const logger = new Logger(config.get("name"));

export default logger;
