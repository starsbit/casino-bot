import { Collection } from "discord.js";
import { CommandInteractions } from "../../models/interactions";
import { balanceCommand } from "./balance";
import { begCommand } from "./beg";
import { decideCommand } from "./decide";
import { hitCommand } from "./hit";

export const commands = new Collection();

commands.set(CommandInteractions.decide, decideCommand);
commands.set(CommandInteractions.hit, hitCommand);
commands.set(CommandInteractions.beg, begCommand);
commands.set(CommandInteractions.balance, balanceCommand);

export const formattedCommands = [
  hitCommand.data.toJSON(),
  decideCommand.data.toJSON(),
  begCommand.data.toJSON(),
  balanceCommand.data.toJSON(),
];
