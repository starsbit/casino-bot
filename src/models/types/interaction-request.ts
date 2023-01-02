import { CommandInteraction, InteractionType } from "discord.js";
import { Observable } from "rxjs";

export type InteractionRequest = {
  data: any;
  type: InteractionType;
  execute: (interaction: CommandInteraction) => Observable<void>;
};
