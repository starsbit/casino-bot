import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { container } from "tsyringe";
import { CommandInteractions } from "../../models/interactions";
import { CommandService } from "../../services/command.service";

const decide = async (interaction: CommandInteraction) => {
  const commandService = container.resolve(CommandService);
  if (
    !commandService.checkInteractionOnCommand(
      interaction,
      CommandInteractions.decide
    )
  ) {
    return;
  }
  const opt = interaction.options;
  const options = opt.get("options");
  if (!options) {
    await interaction.reply("Please provide an option!");
    return;
  }
  const optionValue = options.value as string;
  if (!optionValue) {
    await interaction.reply("Please provide an option!");
    return;
  }
  const optionValues = optionValue.split(",");
  const fields = optionValues.map((value, index) => {
    return { name: `Option ${index + 1}`, value: value };
  });
  const embed = new EmbedBuilder()
    .setTitle("I am deciding...")
    .setDescription("I am deciding for you...")
    .setColor("#FEDD00")
    .setThumbnail(interaction.user.displayAvatarURL())
    .setFields(fields);
  await interaction.reply({ embeds: [embed] }).then(async () => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const randomIndex = Math.floor(Math.random() * optionValues.length);
    fields[randomIndex].value = `__**${fields[randomIndex].value}**__`;
    const embed = new EmbedBuilder()
      .setTitle("I have made a decision!")
      .setDescription(
        "I have decided that '" +
          optionValues[randomIndex] +
          "' is the best option for you!"
      )
      .setFields(fields)
      .setColor("#2A52BE")
      .setThumbnail(interaction.user.displayAvatarURL());
    await interaction.editReply({ embeds: [embed] });
  });
};

export const decideCommand = {
  data: new SlashCommandBuilder()
    .setName(CommandInteractions.decide)
    .setDescription("Decides between options. Separate options with commas.")
    .addStringOption((option) =>
      option
        .setName("options")
        .setDescription(
          "The options on which to decide on. Seperate with commas: 'o1,o2,o3'"
        )
        .setRequired(true)
    ),
  execute: decide,
};
