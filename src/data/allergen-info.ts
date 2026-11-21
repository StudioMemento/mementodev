import type { Language } from "../i18n";

export type Approval = {
  codes: number[];
  crossContact?: number[];
  details?: Partial<Record<Language, string>>;
};
declare const __FOOD_PUBLIC__: Record<string, Approval>;
export const approvedItem = (key: string) => __FOOD_PUBLIC__[key];
const legacy: Record<string, number[]> = { "Aggiunta di Bufala": [7], "Impasto integrale": [1] };

export function foodId(name: string) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");
}

export function getAllergenInfo(name = "", _description = "", original = "") {
  const record = approvedItem(foodId(name));
  const printed = (original.match(/\d+/g) ?? []).map(Number).filter(n => n >= 1 && n <= 14);
  const codes = [...new Set(record ? record.codes : [...printed, ...(legacy[name] ?? [])])].sort((a, b) => a - b);
  return { codes, approved: Boolean(record), details: record?.details, crossContact: record?.crossContact ?? [], frozen: original.includes("*") };
}
