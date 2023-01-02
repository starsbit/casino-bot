import {
  CommandInteraction,
  InteractionType,
  SlashCommandBuilder,
} from "discord.js";
import { Observable } from "rxjs";

export type SlashCommand = {
  data: SlashCommandBuilder;
  type: InteractionType;
  execute: (interaction: CommandInteraction) => Observable<void>;
};
