import { Client, Events, IntentsBitField, Interaction } from "discord.js";
import { container, inject, singleton } from "tsyringe";
import { environment } from "../models/environment";
import { logger } from "../utils/logger";
import { CommandService } from "./command.service";
import { InteractionExecutor } from "./interaction-execution.service";

@singleton()
export class ClientService {
  private executor = container.resolve(InteractionExecutor);
  private client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.MessageContent,
    ],
  });

  constructor(
    @inject("CommandService") private commandService: CommandService
  ) {
    this.client.login(environment.botToken);
    commandService.registerCommands(
      environment.applicationId!,
      environment.botToken!
    );

    this.setup();
  }

  private setup = () => {
    this.client.on(Events.ClientReady, () => {
      logger.info("Client is ready!");
    });

    this.client.on(
      Events.InteractionCreate,
      async (interaction: Interaction) => {
        this.executor.execute(interaction);
      }
    );
  };
}
