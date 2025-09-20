import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Divider,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function BookModal({ open, handleClose, book, rating }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!book) return;

    setDetails(null);

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://openlibrary.org${book.key}.json`);
        const data = await res.json();
        setDetails(data);
      } catch (err) {
        console.error("Error fetching book details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [book]);

  // Aggressive cleaning function
  const cleanDescription = (desc) => {
    if (!desc) return "No description available.";
    let text = typeof desc === "string" ? desc : desc.value || "";

    // --- Normalize newlines and trim ---
    text = text.replace(/\r\n|\r|\n/g, " ").trim();

    // Remove [source] and everything that follows
    text = text.replace(/\[source\][\s\S]*$/gi, "").trim();

    // Remove Markdown footnotes like: [Wikipedia][1]
    text = text.replace(/\[[^\]]+\]\[\d+\]/g, " ").trim();

    // Remove footnote definitions like: [1]: http://...
    text = text.replace(/^\s*\[\d+\]:\s*\S+(?:\s+\S+)*$/gim, " ").trim();
    text = text.replace(/\[\d+\]:/g, " ").trim();

    // Convert inline markdown links [text](url) -> text
    text = text.replace(/\[([^\]]+)\]\((?:[^)]+)\)/g, "$1");

    // Remove raw URLs
    text = text.replace(/https?:\/\/\S+/gi, " ");

    // Remove divider lines like ---------- or =======
    text = text.replace(/[-=]{3,}/g, " ");

    // Remove "Contained in:" or "See also:" sections and everything after them
    text = text.replace(/\b(?:Contained in:|See also:)[\s\S]*$/gi, "").trim();

    // Specifically remove starred-bold variants like "**Also" or "***Also."
    text = text.replace(/\*+\s*Also\b[:.]?\s*/gi, " ");

    // Remove leftover asterisks or underscores used for markdown emphasis
    text = text.replace(/[*_]{1,}/g, " ");

    // Remove bracketed numeric citations like [1] (leftover)
    text = text.replace(/\s*\[\d+\]\s*/g, " ");

    // Remove empty parentheses/brackets/braces anywhere e.g. "()" or "( )"
    text = text.replace(/\(\s*\)|\[\s*\]|\{\s*\}/g, " ");

    // Remove trailing unmatched open parentheses/brackets/braces
    text = text.replace(/[\(\[\{]\s*$/g, " ");

    // Remove odd single-word artifacts (e.g. stray "Also")
    text = text.replace(/\bAlso\.?$/i, " ");
    text = text.replace(/^[\s\.\-:,;\/]+|[\s\.\-:,;\/]+$/g, " ");

    // Collapse multiple spaces to one and trim
    text = text.replace(/\s+/g, " ").trim();

    // If text is empty after cleanup, return fallback
    if (!text || text.replace(/[^\w]/g, "").length < 3) {
      return "No description available.";
    }

    // Ensure it ends with punctuation
    if (!/[.!?]$/.test(text)) {
      text = text + ".";
    }

    return text;
  };

  const coverId = book.cover_i;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : "https://via.placeholder.com/300x450?text=No+Cover";

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900,
          height: "80vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          display: "flex",
          overflow: "hidden",
        }}
      >
        <IconButton onClick={handleClose} sx={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}>
          <CloseIcon />
        </IconButton>

        <Box sx={{ flex: "0 0 300px", bgcolor: "grey.100" }}>
          <img src={coverUrl} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Box>

        <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            details && (
              <>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {book.title}
                </Typography>

                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
                </Typography>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  ⭐ {rating} | 📅 {book.first_publish_year || "Unknown"}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Cleaned Description */}
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {cleanDescription(details.description)}
                </Typography>

                {/* Subjects */}
                {details.subjects && (
                  <>
                    <Typography variant="subtitle1" gutterBottom>
                      Subjects:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                      {details.subjects.slice(0, 10).map((subj, idx) => (
                        <Chip key={idx} label={subj} variant="outlined" />
                      ))}
                    </Box>
                  </>
                )}

                {/* Places */}
                {details.subject_places && (
                  <>
                    <Typography variant="subtitle1" gutterBottom>
                      Places:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {details.subject_places.map((place, idx) => (
                        <Chip key={idx} label={place} color="secondary" />
                      ))}
                    </Box>
                  </>
                )}
              </>
            )
          )}
        </Box>
      </Box>
    </Modal>
  );
}
