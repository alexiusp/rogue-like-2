import { createEffect, createEvent, sample } from "effector";

const event1 = createEvent();
export const event2 = createEvent();

export const experimentFX = createEffect(
  () =>
    new Promise((resolve) => {
      event1();
      return setTimeout(resolve, 100);
    }),
);

event1.watch(() => console.log("event1"));
event2.watch(() => console.log("event2"));

sample({
  clock: event2,
  fn: experimentFX,
});

experimentFX.done.watch(() => console.log("experimentFX.done"));
