"use client";

interface SearchOverlayProps {
  onClose: () => void;
}

export function SearchOverlay({ onClose }: SearchOverlayProps) {
  return (
    <div
      className="fixed inset-x-0 top-16 bottom-0 z-40 bg-transparent animate-in fade-in duration-200"
      onMouseDown={onClose}
    />
  );
}
