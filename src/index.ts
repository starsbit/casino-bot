import "reflect-metadata";
import { ClientService } from "./services/client.service";
import { CommandService } from "./services/command.service";

new ClientService(new CommandService());
