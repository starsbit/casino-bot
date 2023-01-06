import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { container } from "tsyringe";
import {
  ButtonInteractions,
  CommandInteractions,
} from "../../models/interactions";
import { CommandService } from "../../services/command.service";
import { DatabaseService } from "../../services/database.service";
import { logger } from "../../utils/logger";

const databaseService = container.resolve(DatabaseService);
const commandService = container.resolve(CommandService);

const hit = async (interaction: CommandInteraction) => {
  if (
    !commandService.checkInteractionOnCommand(
      interaction,
      CommandInteractions.hit
    )
  ) {
    return;
  }
  let user = await databaseService.getUser(interaction.user.id);

  if (user === null || user === undefined) {
    user = await databaseService.createUser(interaction.user.id);
  }
  if (user === null || user === undefined) {
    await interaction.reply("Something went wrong!");
    logger.error("User is null or undefined when executing hit command!", user);
    return;
  }
  if (user.balance < 10) {
    const embed = new EmbedBuilder()
      .setTitle("Not enough funds!")
      .setDescription("You need more than 10 to play!")
      .setColor("#FF0000")
      .setThumbnail(interaction.user.displayAvatarURL());
    await interaction.reply({ embeds: [embed] });
    return;
  }
  databaseService.updateUser(user.id, { balance: user.balance - 10 });
  const score = 10;
  const embed = new EmbedBuilder()
    .setTitle("Hit")
    .setDescription("Current score: " + score)
    .setColor("#FEDD00")
    .setThumbnail(interaction.user.displayAvatarURL());
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(ButtonInteractions.hit)
      .setLabel("Hit")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(ButtonInteractions.cashout)
      .setLabel("Cash out")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true)
  );

  await interaction.reply({ embeds: [embed], components: [row] });
};

export const hitCommand = {
  data: new SlashCommandBuilder()
    .setName(CommandInteractions.hit)
    .setDescription(
      "Simple hit game. Pressing Hit doubles your score or you lose all. Cash out, gives you your score."
    ),
  execute: hit,
};
