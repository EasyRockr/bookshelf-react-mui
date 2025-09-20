import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  Grid,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import BookCards from "./BookCards";

export default function BrowseBooks() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    setBooks([]);
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${query}`);
      const data = await res.json();
      setBooks(data.docs.slice(0, 24));
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {!searched && (
        <Box
          sx={{
            minHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Browse Books
          </Typography>
          <Box sx={{ display: "flex", gap: 1, width: "700px" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for books, authors, or subjects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" onClick={handleSearch}>
              Search
            </Button>
          </Box>
        </Box>
      )}

      {searched && (
        <Box sx={{ mt: 3 }}>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mb: 3,
              width: "700px",
              mx: "auto",
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for books, authors, or subjects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" onClick={handleSearch}>
              Search
            </Button>
          </Box>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <CircularProgress color="white"/>
            </Box>
          )}

          {!loading && books.length === 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: "center",
                  maxWidth: 400,
                  bgcolor: "background.default",
                }}
              >
                <SentimentDissatisfiedIcon
                  sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  No Results Found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We couldn’t find any books matching your search. <br />
                  Try a different keyword or check your spelling.
                </Typography>
              </Paper>
            </Box>
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
