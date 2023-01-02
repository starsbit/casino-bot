import { client } from "./client";
import { environment } from "./models/environment";
import { registerCommands } from "./utils/commands-utils";

client.login(environment.botToken);

registerCommands(environment.applicationId!, environment.botToken!);
