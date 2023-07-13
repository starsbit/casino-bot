import {
  Client,
  Events,
  IntentsBitField,
  Interaction,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";
import { container, inject, singleton } from "tsyringe";
import { environment } from "../models/environment";
import { logger } from "../utils/logger";
import { CommandService } from "./command.service";
import { InteractionExecutor } from "./interaction-execution.service";
import { ReactionExecutor } from "./reaction-execution.service";

@singleton()
export class ClientService {
  private interactionExecutor = container.resolve(InteractionExecutor);
  private reactionExecutor = container.resolve(ReactionExecutor);
  private client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.MessageContent,
      IntentsBitField.Flags.GuildMessageReactions,
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
        this.interactionExecutor.execute(interaction);
      }
    );

    this.client.on(
      Events.MessageReactionAdd,
      async (
        reaction: MessageReaction | PartialMessageReaction,
        user: User | PartialUser
      ) => {
        this.reactionExecutor.execute(reaction, user, this.client);
      }
    );
  };
}
