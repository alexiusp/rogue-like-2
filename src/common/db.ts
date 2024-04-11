export type TSaveSlotName = "slot-1" | "slot-2" | "slot-3";

let currentSaveSlot: TSaveSlotName | undefined;

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

export function clearCurrentSlot() {
  currentSaveSlot = undefined;
  sessionStorage.removeItem("current-save");
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
  if (!currentSaveSlot) {
    return;
  }
  localStorage.setItem(currentSaveSlot, name);
}

// load "user" data linked to currently active saving slot
export function loadCharacterData<T>(key: string): T | null {
  const currentSlot = getCurrentSlot();
  if (!currentSlot) {
    console.warn("Slot to load data is not defined!");
    return null;
  }
  const compiledKey = `${currentSlot}-${key}`;
  const dataStr = localStorage.getItem(compiledKey);
  return dataStr !== null ? JSON.parse(dataStr) : dataStr;
}

// load global data shared for all characters
export function loadSharedData<T>(key: string): T | null {
  const compiledKey = `shared-${key}`;
  const dataStr = localStorage.getItem(compiledKey);
  return dataStr !== null ? JSON.parse(dataStr) : dataStr;
}

// save "user" data linked to currently active saving slot
export function saveCharacterData<T>(key: string, data: T) {
  const currentSlot = getCurrentSlot();
  if (!currentSlot) {
    console.warn("Slot to save data is not defined!");
    return;
  }
  const compiledKey = `${currentSlot}-${key}`;
  return localStorage.setItem(compiledKey, JSON.stringify(data));
}

export function saveSharedData<T>(key: string, data: T) {
  const compiledKey = `shared-${key}`;
  return localStorage.setItem(compiledKey, JSON.stringify(data));
}
