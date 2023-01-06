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

const hit = (interaction: CommandInteraction) => {
  const commandService = container.resolve(CommandService);
  if (
    !commandService.checkInteractionOnCommand(
      interaction,
      CommandInteractions.hit
    )
  ) {
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
