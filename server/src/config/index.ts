import { Config } from "@/lib/config";
import { appLoad } from "./loads/app.load";
import { jwtLoad } from "./loads/jwt.load";
import { awsLoad } from "./loads/aws.load";
import { mailLoad } from "./loads/mail.load";

const config = new Config({ loads: [appLoad, awsLoad, jwtLoad, mailLoad] });

export default config;
