import { Client, Events, IntentsBitField } from "discord.js";
import { InteractionExecutor } from "./interactions/interactionExecutor";
import { logger } from "./utils/logger";

export const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const executor = new InteractionExecutor();

client.on(Events.ClientReady, () => {
  logger.info("Client is ready!");
});

client.on(Events.InteractionCreate, async (interaction) => {
  executor.execute(interaction);
});
