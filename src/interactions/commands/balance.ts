import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { container } from "tsyringe";
import { CommandInteractions } from "../../models/interactions";
import { DatabaseService } from "../../services/database.service";
import { logger } from "../../utils/logger";

const databaseService = container.resolve(DatabaseService);

const balance = async (interaction: CommandInteraction) => {
  let user = await databaseService.getUser(interaction.user.id);

  if (user === null || user === undefined) {
    user = await databaseService.createUser(interaction.user.id);
  }
  if (user === null || user === undefined) {
    await interaction.reply("Something went wrong!");
    logger.error("User is null or undefined when executing beg command!", user);
    return;
  }
  const embed = new EmbedBuilder()
    .setTitle("Current balance")
    .setDescription("Your balance is **" + user.balance + "**!")
    .setThumbnail(interaction.user.displayAvatarURL());
  await interaction.reply({ embeds: [embed] });
};

export const balanceCommand = {
  data: new SlashCommandBuilder()
    .setName(CommandInteractions.balance)
    .setDescription("View your balance."),
  execute: balance,
};
