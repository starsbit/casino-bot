import { CommandInteraction, REST, Routes } from "discord.js";
import { singleton } from "tsyringe";
import { formattedCommands } from "../interactions/commands/commands";
import { logger } from "../utils/logger";

@singleton()
export class CommandService {
  public registerCommands = (applicationId: string, token: string) => {
    const rest = new REST({ version: "10" }).setToken(token);
    rest
      .put(Routes.applicationCommands(applicationId), { body: [] })
      .then(() => logger.info("Successfully deleted all application commands."))
      .catch(logger.error);

    rest
      .put(Routes.applicationCommands(applicationId), {
        body: formattedCommands,
      })
      .then(() => logger.info("Successfully registered application commands."))
      .catch(logger.error);
  };

  public checkInteractionOnCommand = (
    interaction: CommandInteraction,
    commandName: string
  ) => {
    if (
      interaction &&
      interaction.isCommand() &&
      interaction.commandName === commandName
    ) {
      return true;
    } else {
      logger.debug("Interaction is not on command: " + commandName);
      return false;
    }
  };
}
