import React from 'react'
import {
  Card, CardActionArea, CardMedia, CardContent,
  Typography, Box, Chip
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import StarIcon from '@mui/icons-material/Star'

export default function BookCard({ book = {}, onClick = () => {} }) {
  const title = book?.title || 'Untitled'
  const author = book?.author || 'Unknown'
  const year = book?.year || 'Unknown'
  const ratingNum =
    typeof book?.rating === 'number'
      ? book.rating
      : (book?.rating ? Number(book.rating) : NaN)
  const rating = Number.isFinite(ratingNum) ? ratingNum.toFixed(1) : 'N/A'
  const img = book?.coverUrl || null

  return (
    <Card
      elevation={2}
      sx={{
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper'
      }}
    >
      <CardActionArea onClick={onClick} sx={{ alignItems: 'stretch' }}>
        {img && (
          <CardMedia
            component="img"
            image={img}
            alt={title}
            sx={{ height: 300, objectFit: 'cover' }}
          />
        )}

        <CardContent sx={{ pb: 1.75 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 800, lineHeight: 1.2 }}
            noWrap
            title={title}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            title={author}
            sx={{ mt: 0.25 }}
          >
            by {author}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Published: {year || 'Unknown'}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 1.0,
            }}
          >
            {book?.trendLabel ? (
              <Chip
                icon={<TrendingUpIcon />}
                label={book.trendLabel}
                size="small"
                sx={{
                  bgcolor: 'grey.800',
                  color: 'grey.100',
                  fontWeight: 800,
                  height: 24,
                  '& .MuiChip-label': { px: 1, pt: '1px' },
                }}
              />
            ) : (
              <Box />
            )}

            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
              <StarIcon fontSize="small" sx={{ color: 'warning.main' }} />
              <Typography variant="body2">{rating}</Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
