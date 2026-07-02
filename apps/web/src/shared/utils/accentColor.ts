// Converts a hex colour to r,g,b components (0-255 each).
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3
    ? h.split("").map((c) => c + c).join("")
    : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function darken(hex: string, factor = 0.85): string {
  const [r, g, b] = hexToRgb(hex);
  const d = (v: number) => Math.max(0, Math.round(v * factor)).toString(16).padStart(2, "0");
  return `#${d(r)}${d(g)}${d(b)}`;
}

// Sets every accent-derived CSS variable on <html> so the entire dashboard
// (sidebar indicator, buttons, focus ring, etc.) reflects the school's colour.
export function applyAccentColor(accentColor: string) {
  if (typeof document === "undefined") return;
  const [r, g, b] = hexToRgb(accentColor);
  const el = document.documentElement;
  el.style.setProperty("--color-accent",              accentColor);
  el.style.setProperty("--color-accent-hover",        darken(accentColor));
  el.style.setProperty("--color-accent-subtle",       `rgba(${r},${g},${b},0.10)`);
  el.style.setProperty("--color-accent-border",       `rgba(${r},${g},${b},0.25)`);
  el.style.setProperty("--color-sidebar-indicator",   accentColor);
  el.style.setProperty("--color-sidebar-icon-active", accentColor);
  el.style.setProperty("--color-sidebar-item-hover",  `rgba(${r},${g},${b},0.06)`);
  el.style.setProperty("--color-sidebar-item-active-bg", `rgba(${r},${g},${b},0.10)`);
}
