import dotenv from "dotenv";

dotenv.config();

export const environment = {
  clientId: process.env.CLIENT_ID,
  applicationId: process.env.APPLICATION_ID,
  clientSecret: process.env.CLIENT_SECRET,
  botToken: process.env.BOT_TOKEN,
};
