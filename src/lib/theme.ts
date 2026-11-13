// Shared page colours.
// The ground the whole site sits on: the page background, the project / CV /
// contact overlays, and the opaque cube faces all use it, so they stay in step.
export const BG_COLOR = "#ffffff";

/**
 * The line under each project title giving place, year and competition/course.
 * It is supporting information, so it reads a step quieter than the body text:
 * smaller, lighter in weight and in colour.
 */
export const META_TEXT = {
  fontSize: "0.6rem",
  fontWeight: 300,
  color: "#6f6f6f",
  letterSpacing: "0.01em",
} as const;
