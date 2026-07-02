"use client";

export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <div
      style={{
        width: size, height: size,
        border: "2px solid var(--color-border)",
        borderTopColor: "var(--color-accent)",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
  );
}
