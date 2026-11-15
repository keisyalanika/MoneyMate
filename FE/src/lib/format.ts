export const formatNumber = (value: number) =>
  new Intl.NumberFormat("id-ID").format(value);

export const formatCompact = (value: number) =>
  new Intl.NumberFormat("id-ID", { notation: "compact" }).format(value);

export const initialOf = (name: string) => (name.trim()[0] ?? "?").toUpperCase();
