import "reflect-metadata";
import { ClientService } from "./services/client.service";
import { CommandService } from "./services/command.service";
import { DatabaseService } from "./services/database.service";

const client = new DatabaseService();

client.connect().then(() => {
  new ClientService(new CommandService());
});
