import { createEvent, createStore } from "effector";

type RoutePath = string;

const initialPath: RoutePath = "menu";
export const $history = createStore<Array<RoutePath>>([initialPath]);

export const forward = createEvent<RoutePath>();
$history.on(forward, (currentStack, newPath) => {
  const newHistory = [...currentStack, newPath];
  return newHistory;
});
export const back = createEvent();
$history.on(back, (currentStack) => {
  const newHistory = [...currentStack];
  newHistory.pop();
  return newHistory;
});
export const replace = createEvent<RoutePath>();
$history.on(replace, (currentStack, newPath) => {
  const newHistory = [...currentStack];
  newHistory.splice(newHistory.length - 1, 1, newPath);
  return newHistory;
});

export const $route = $history.map((historyStack) =>
  historyStack.length ? historyStack[historyStack.length - 1] : "",
);

export const navigate = forward;
