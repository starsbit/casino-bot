import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { checkInteractionOnCommand } from "../../utils/commands-utils";
import { ButtonInteractions, CommandInteractions } from "../interactions";

const hit = (interaction: CommandInteraction) => {
  if (!checkInteractionOnCommand(interaction, CommandInteractions.hit)) {
    return;
  }
  const score = 100;
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

  interaction.reply({ embeds: [embed], components: [row] });
};

export const hitCommand = {
  data: new SlashCommandBuilder()
    .setName(CommandInteractions.hit)
    .setDescription(
      "Simple hit game. Pressing Hit doubles your score or you lose all. Cash out, gives you your score."
    ),
  execute: hit,
};
