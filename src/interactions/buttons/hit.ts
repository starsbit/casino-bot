import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { container } from "tsyringe";
import { ButtonInteractions } from "../../models/interactions";
import { DatabaseService } from "../../services/database.service";

const databaseService = container.resolve(DatabaseService);

export const hitInteraction = (interaction: ButtonInteraction) => {
  const score = parseInt(
    interaction.message.embeds[0].description!.match(/\d+/)![0]
  );
  let row: ActionRowBuilder<ButtonBuilder>;
  let embed: EmbedBuilder;
  if (Math.random() > 0.55) {
    embed = new EmbedBuilder()
      .setTitle("Hit")
      .setDescription("Current score: " + score * 2)
      .setColor("#FEDD00")
      .setThumbnail(interaction.user.displayAvatarURL());
    row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(ButtonInteractions.hit)
        .setLabel("Hit")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(ButtonInteractions.cashout)
        .setLabel("Cash out")
        .setStyle(ButtonStyle.Secondary)
    );
  } else {
    embed = new EmbedBuilder()
      .setTitle("Lose")
      .setDescription("You lost all your score!")
      .setColor("#FF0000")
      .setThumbnail(interaction.user.displayAvatarURL());
    row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(ButtonInteractions.hit)
        .setLabel("Hit")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId(ButtonInteractions.cashout)
        .setLabel("Cash out")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true)
    );
  }
  interaction.update({ embeds: [embed], components: [row] });
};

export const cashoutInteraction = (interaction: ButtonInteraction) => {
  const score = parseInt(
    interaction.message.embeds[0].description!.match(/\d+/)![0]
  );
  databaseService.getUser(interaction.user.id).then((user) => {
    if (user === null || user === undefined) {
      return;
    }
    user.balance += score;
    databaseService.updateUser(user.id, {
      balance: user.balance,
    });
  });
  const embed = new EmbedBuilder()
    .setTitle("Cash out")
    .setDescription("You cashed out with " + score + " points!")
    .setColor("#00FF00")
    .setThumbnail(interaction.user.displayAvatarURL());
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(ButtonInteractions.hit)
      .setLabel("Hit")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true),
    new ButtonBuilder()
      .setCustomId(ButtonInteractions.cashout)
      .setLabel("Cash out")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true)
  );
  interaction.update({ embeds: [embed], components: [row] });
};
