import { ButtonInteractions } from "../interactions";
import { cashoutInteraction, hitInteraction } from "./hit";

export const buttonInteractionHandler = new Map();

buttonInteractionHandler.set(ButtonInteractions.hit, {
  execute: hitInteraction,
});
buttonInteractionHandler.set(ButtonInteractions.cashout, {
  execute: cashoutInteraction,
});
