"use client";

const STORAGE_KEY = "paint-hub-inventory";

export function getInventory(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set<string>(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function saveInventory(ids: Set<string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
}

export function addPaint(paintId: string): void {
  const inv = getInventory();
  inv.add(paintId);
  saveInventory(inv);
}

export function removePaint(paintId: string): void {
  const inv = getInventory();
  inv.delete(paintId);
  saveInventory(inv);
}

export function isOwned(paintId: string): boolean {
  return getInventory().has(paintId);
}

export function togglePaint(paintId: string): boolean {
  const inv = getInventory();
  if (inv.has(paintId)) {
    inv.delete(paintId);
    saveInventory(inv);
    return false;
  } else {
    inv.add(paintId);
    saveInventory(inv);
    return true;
  }
}
