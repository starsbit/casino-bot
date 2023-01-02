import { Collection } from "discord.js";
import { CommandInteractions } from "../interactions";
import { decideCommand } from "./decide";
import { hitCommand } from "./hit";

export const commands = new Collection();

commands.set(CommandInteractions.decide, decideCommand);
commands.set(CommandInteractions.hit, hitCommand);

export const formattedCommands = [
  hitCommand.data.toJSON(),
  decideCommand.data.toJSON(),
];
