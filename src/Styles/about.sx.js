import { alpha } from "@mui/material/styles";

export const heroCardSx = (t) => ({ maxWidth: 860, mx: "auto", my: 3, textAlign: "center" });
export const avatarSx = (t) => ({ width: 100, height: 100, mx: "auto", mb: 1 });
export const chipRowSx = (t) => ({ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center", mt: 1 });
export const subCardSx = (t) => ({ height: "100%" });
export const mt2 = { mt: 2 };

/* === extracted from about.jsx === */
export const cardSx = {
  borderRadius: 3,
  overflow: "hidden",
  background: `linear-gradient(180deg, ${alpha("#0e1116", 0.9)}, ${alpha("#0b0f14", 0.95)})`,
  boxShadow: `0 12px 40px ${alpha("#000", 0.7)}`,
};

export const cardContentSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
};

export const bigAvatarSx = {
  width: 160,
  height: 160,
  fontSize: 54,
  fontWeight: 900,
  bgcolor: alpha("#6aa8ff", 0.22),
  color: "#c7dcff",
  border: `3px solid ${alpha("#6aa8ff", 0.8)}`,
};

export const tabsSx = {
  maxWidth: 360,
  mx: "auto",
  "& .MuiTab-root": { fontWeight: 800, minWidth: 120 },
};

export const textFieldSx = {
  "& .MuiInputBase-root": { bgcolor: "rgba(255,255,255,0.04)", borderRadius: 2 },
};

export const skillsBoxSx = {
  display: "flex",
  flexWrap: "wrap",
  gap: 1,
  maxHeight: 260,
  overflow: "auto",
  pr: 0.5,
  "&::-webkit-scrollbar": { width: 8 },
  "&::-webkit-scrollbar-thumb": { background: "rgba(106,168,255,0.4)", borderRadius: 8 },
};

export const pageContainerSx = {
  px: { xs: 1.5, md: 3 },
  py: { xs: 2, md: 3 },
};

export const headingSx = {
  mb: 2,
  textAlign: "center",
  fontWeight: 900,
};

export const personCardWrapperSx = {
  width: { xs: "100%", sm: "98%", md: "94%", lg: "90%" },
  maxWidth: 1280,
};

export const chipStyle = (label) => {
  const palette = ["#60a5fa", "#22d3ee", "#34d399", "#f59e0b", "#a78bfa", "#fb7185", "#f97316"];
  const i = (label.charCodeAt(0) + label.length) % palette.length;
  const bg = palette[i];
  return {
    bgcolor: alpha(bg, 0.28),
    border: `1px solid ${alpha(bg, 0.7)}`,
    color: "#fff",
    fontWeight: 800,
  };
};
