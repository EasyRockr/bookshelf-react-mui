import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";
import CasinoIcon from '@mui/icons-material/Casino';
import BookCards from "./BookCards";

const subjects = [
  "fiction",
  "science",
  "history",
  "mystery",
  "romance",
  "fantasy",
  "biography",
  "adventure",
  "thriller",
  "comedy",
  "drama",
  "poetry",
];

export default function SurpriseMe() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subjectIndex, setSubjectIndex] = useState(0);
  const [started, setStarted] = useState(false);

  const fetchRandomBooks = async () => {
    setLoading(true);
    setStarted(true);
    setBooks([]);

    const subject = subjects[subjectIndex];
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?subject=${subject}`
      );
      const data = await res.json();

      const shuffled = data.docs.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 12);

      setBooks(selected);

      setSubjectIndex((prev) => (prev + 1) % subjects.length);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {!started && (
        <Box
          sx={{
            minHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Random Book Discovery
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Discover new books with our surprise selection
          </Typography>
          <Button variant="contained" onClick={fetchRandomBooks}>
            <CasinoIcon sx={{mr:2}}/> Surprise Me!
          </Button>
        </Box>
      )}

      {started && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Button variant="contained" onClick={fetchRandomBooks}>
              <CasinoIcon sx={{mr:2}}/> Surprise Me Again!
            </Button>
          </Box>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && books.length === 0 && (
            <Typography align="center" sx={{ mt: 5 }}>
              No books found for this subject.
            </Typography>
          )}

          <Grid container spacing={2} justifyContent="center">
            {books.map((book, index) => (
              <Grid item key={index}>
                <BookCards book={book} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
