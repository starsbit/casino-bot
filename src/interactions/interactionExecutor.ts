import { ButtonInteraction, CommandInteraction, Interaction } from "discord.js";
import { SlashCommand } from "../models/types/slash-commands";
import { logger } from "../utils/logger";
import { buttonInteractionHandler } from "./buttons/buttonInteractions";
import { commands } from "./commands/commands";

export class InteractionExecutor {
  public execute = (interaction: Interaction) => {
    if (interaction.isCommand()) {
      this.executeApplicationCommand(
        commands.get(interaction.commandName) as SlashCommand,
        interaction
      );
    } else if (interaction.isButton()) {
      this.executeButtonInteraction(interaction);
    } else if (interaction.isChatInputCommand()) {
      // TODO: Implement chat input commands
      // TF is this?
    } else {
      logger.warn("Unhandled interaction type!", interaction);
    }
  };

  private executeButtonInteraction = (interaction: ButtonInteraction) => {
    try {
      buttonInteractionHandler.get(interaction.customId).execute(interaction);
    } catch (error) {
      logger.error(error);
      interaction.reply({
        content: "There was an error while executing this button!",
        ephemeral: true,
      });
    }
  };

  private executeApplicationCommand = (
    command: SlashCommand,
    interaction: CommandInteraction
  ) => {
    try {
      command.execute(interaction);
    } catch (error) {
      logger.error(error);
      interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  };
}
