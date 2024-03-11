export type TSaveSlotName = "slot-1" | "slot-2" | "slot-3";

let currentSaveSlot: TSaveSlotName;

export type TSaveSlotsState = {
  "slot-1": string | null;
  "slot-2": string | null;
  "slot-3": string | null;
};

export function getSlotsState(): TSaveSlotsState {
  const slot1 = localStorage.getItem("slot-1");
  const slot2 = localStorage.getItem("slot-2");
  const slot3 = localStorage.getItem("slot-3");
  return {
    "slot-1": slot1,
    "slot-2": slot2,
    "slot-3": slot3,
  };
}

export function setCurrentSlot(slot: TSaveSlotName) {
  currentSaveSlot = slot;
  sessionStorage.setItem("current-save", slot);
}

export function getCurrentSlot() {
  if (currentSaveSlot) {
    return currentSaveSlot;
  }
  const slot = sessionStorage.getItem("current-save");
  if (slot === null) {
    return;
  }
  currentSaveSlot = slot as TSaveSlotName;
  return slot;
}

export function setSlotName(name: string) {
  localStorage.setItem(currentSaveSlot, name);
}

export function loadData<T>(key: string): T | null {
  const currentSlot = getCurrentSlot();
  if (!currentSlot) {
    console.warn("Slot to load data is not defined!");
    return null;
  }
  const compiledKey = `${currentSlot}-${key}`;
  const dataStr = localStorage.getItem(compiledKey);
  return dataStr !== null ? JSON.parse(dataStr) : dataStr;
}

export function saveData<T>(key: string, data: T) {
  const currentSlot = getCurrentSlot();
  if (!currentSlot) {
    console.warn("Slot to save data is not defined!");
    return;
  }
  const compiledKey = `${currentSlot}-${key}`;
  return localStorage.setItem(compiledKey, JSON.stringify(data));
}
