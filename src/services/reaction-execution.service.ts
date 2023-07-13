import {
  Client,
  EmbedAuthorOptions,
  EmbedBuilder,
  EmbedFooterOptions,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  TextChannel,
  User,
} from "discord.js";
import { singleton } from "tsyringe";
import { channelIds } from "../constants/channelIds";

@singleton()
export class ReactionExecutor {
  public readonly MINIMAL_REACTION_COUNT = 2;

  private reactionPostChannel: TextChannel | undefined = undefined;

  execute = (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
    client: Client
  ) => {
    this.executeReaction(reaction, user, client);
  };

  public executeReaction(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
    client: Client
  ) {
    if (reaction.message.author && reaction.message.author.bot) {
      return;
    }
    const reactionCount = reaction.count;
    if (!reactionCount) {
      return;
    }

    if (reactionCount >= this.MINIMAL_REACTION_COUNT) {
      this.postReaction(reaction, user, client);
    }
  }

  private postReaction = (
    reaction: MessageReaction,
    user: User | PartialUser,
    client: Client
  ) => {
    if (!this.reactionPostChannel) {
      let channel = client.channels.cache.get(channelIds.reactionChannelId);
      if (!channel || !(channel instanceof TextChannel)) {
        return;
      }
      this.reactionPostChannel = channel;
    }
    if (!(reaction.message.channel instanceof TextChannel)) {
      return;
    }
    const textChannel: TextChannel = reaction.message.channel;
    if (textChannel.id === this.reactionPostChannel.id) {
      return;
    }
    if (
      !textChannel
        .permissionsFor(textChannel.guild.roles.everyone)
        .has("ViewChannel")
    ) {
      return;
    }
    for (let message of this.reactionPostChannel.messages.cache) {
      if (message[1].embeds.length > 0) {
        if (message[1].embeds[0]!.url === reaction.message.url) {
          return;
        }
      }
    }
    const author: EmbedAuthorOptions = {
      name: reaction.message.author?.username
        ? reaction.message.author?.username
        : "Unknown User",
      iconURL: reaction.message.author!.avatarURL()
        ? reaction.message.author!.avatarURL()!
        : undefined,
    };

    const embedFooterSettings: EmbedFooterOptions = {
      text: textChannel.name ?? "Unknown Channel",
    };

    const description =
      reaction.message.content +
      "\n\n" +
      "[Jump to message](" +
      reaction.message.url +
      ")";

    const embed = new EmbedBuilder()
      .setAuthor(author)
      .setDescription(description)
      .setTimestamp(reaction.message.createdAt)
      .setURL(reaction.message.url)
      .setColor(reaction.message.member?.displayColor ?? "Random")
      .setFooter(embedFooterSettings);

    if (reaction.message.attachments.size > 0) {
      embed.setImage(reaction.message.attachments.first()!.url ?? null);
    }
    if (reaction.message.embeds.length > 0) {
      embed.setImage(reaction.message.embeds[0].thumbnail?.url ?? null);
    }
    this.reactionPostChannel?.send({ embeds: [embed] });
  };
}
