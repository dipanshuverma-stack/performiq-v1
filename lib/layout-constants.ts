export const LAYOUT = {
  sidebarWidth: 248,
  collapsedSidebarWidth: 72,
  headerHeight: 64,
  footerHeight: 48,
  containerMaxWidth: "7xl",
  pagePadding: 6, // Tailwind spacing scale (p-6)
  contentMaxWidth: "max-w-7xl",
  wideContentMaxWidth: "max-w-none",
} as const;

export type LayoutConfig = typeof LAYOUT;