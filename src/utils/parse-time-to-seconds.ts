export default function parseTimeToSeconds(input: string): number | null {
  if (!input) return null;

  const value = input.trim().toLowerCase();
  if (value === "") return null;

  /* ---------- raw seconds ---------- */
  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  /* ---------- colon formats ---------- */
  if (value.includes(":")) {
    const parts = value.split(":").map((p) => Number(p));

    if (parts.some((n) => Number.isNaN(n))) {
      throw new Error("Invalid time format");
    }

    if (parts.length === 2) {
      const [m, s] = parts;
      return m * 60 + s;
    }

    if (parts.length === 3) {
      const [h, m, s] = parts;
      return h * 3600 + m * 60 + s;
    }

    if (parts.length === 4) {
      const [h, m, s] = parts;
      return h * 3600 + m * 60 + s; // ignore frames
    }

    throw new Error("Invalid time format");
  }

  /* ---------- h/m/s formats ---------- */

  const timeRegex =
    /^(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?\s*(?:(\d+)\s*s?)?$/;

  const match = value.match(timeRegex);

  if (match) {
    const hours = Number(match[1] ?? 0);
    const minutes = Number(match[2] ?? 0);
    const seconds = Number(match[3] ?? 0);

    if (hours || minutes || seconds) {
      return hours * 3600 + minutes * 60 + seconds;
    }
  }

  throw new Error("Invalid time format");
}