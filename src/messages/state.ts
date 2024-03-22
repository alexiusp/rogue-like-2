import { createDomain, createEvent } from "effector";
import { loadCharacterData, saveCharacterData } from "../common/db";

const messagesDomain = createDomain("messages");

messagesDomain.onCreateStore((store) => {
  const key = `${messagesDomain.shortName}-${store.shortName}`;
  const value = loadCharacterData(key);
  store.setState(value !== null ? value : []);
});
messagesDomain.onCreateStore((store) => {
  const key = `${messagesDomain.shortName}-${store.shortName}`;
  store.watch((value) => {
    saveCharacterData(key, value);
  });
});

export const $messages = messagesDomain.createStore<string[]>([], {
  name: "list",
});

export const messageAdded = createEvent<string>();
$messages.on(messageAdded, (state, message) => {
  return [...state, message];
});
