import { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
} from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import BookModal from "./BookModal";

function getRandomRating() {
  return (Math.random() * (5 - 1) + 1).toFixed(1);
}

export default function BookCards({ book }) {
  const [open, setOpen] = useState(false);

  const coverId = book.cover_i;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : "https://via.placeholder.com/150x200?text=No+Cover";

  const rating = getRandomRating();

  return (
    <>
      <Card
        onClick={() => setOpen(true)}
        sx={{
          width: 180,
          height: 320,
          mx: "auto",
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          "&:hover": { boxShadow: 6 },
        }}
      >
        <CardMedia
          component="img"
          image={coverUrl}
          alt={book.title}
          sx={{
            height: 200,
            objectFit: "cover",
          }}
        />
        <CardContent sx={{ flex: 1, p: 1.5 }}>
          <Typography variant="subtitle2" fontWeight="bold" noWrap>
            {book.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarTodayOutlinedIcon
                sx={{ fontSize: 14, color: "text.secondary" }}
              />
              <Typography variant="caption" color="text.secondary">
                {book.first_publish_year || "Unknown"}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              ⭐ {rating}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <BookModal
        open={open}
        handleClose={() => setOpen(false)}
        book={book}
        rating={rating}
      />
    </>
  );
}
