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

const beg = async (interaction: CommandInteraction) => {
  let user = await databaseService.getUser(interaction.user.id);

  if (user === null || user === undefined) {
    user = await databaseService.createUser(interaction.user.id);
  }
  if (user === null || user === undefined) {
    await interaction.reply("Something went wrong!");
    logger.error("User is null or undefined when executing beg command!", user);
    return;
  }
  let embed;
  if (user.balance < 10) {
    embed = new EmbedBuilder()
      .setTitle("Funds received!")
      .setDescription("Your balance was set to 10!")
      .setColor("#FEDD00")
      .setThumbnail(interaction.user.displayAvatarURL());
    user.balance = 10;
    await databaseService.updateUser(user.id, {
      balance: user.balance,
    });
  } else {
    embed = new EmbedBuilder()
      .setTitle("No funds received!")
      .setDescription("You already have more than 10!")
      .setColor("#FF0000")
      .setThumbnail(interaction.user.displayAvatarURL());
  }
  await interaction.reply({ embeds: [embed] });
};

export const begCommand = {
  data: new SlashCommandBuilder()
    .setName(CommandInteractions.beg)
    .setDescription(
      "Beg for money. If you have less than 10, you will get 10. If you have more, you will get nothing."
    ),
  execute: beg,
};
