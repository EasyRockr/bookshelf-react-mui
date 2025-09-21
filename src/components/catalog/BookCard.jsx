import React from 'react'
import {
  Card, CardActionArea, CardMedia, CardContent,
  Typography, Box, Chip
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import StarIcon from '@mui/icons-material/Star'

/**
 * Props:
 * - fill: make card stretch to container width (use for 6-up CSS grid)
 * - compact: shorter card + smaller text
 * - showTrendChip: render the footer chip (turn OFF when overlay chip is used)
 */
export default function BookCard({
  book = {},
  onClick = () => {},
  fill = false,
  compact = false,
  showTrendChip = true,
}) {
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
        width: fill ? '100%' : 240,
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardActionArea onClick={onClick} sx={{ alignItems: 'stretch' }}>
        {img && (
          /* 2:3 aspect ratio (lower % when compact to shorten total card height) */
          <Box sx={{ position: 'relative', width: '100%', pt: compact ? '135%' : '150%' }}>
            <CardMedia
              component="img"
              image={img}
              alt={title}
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </Box>
        )}

        <CardContent
          sx={{
            pt: compact ? 1 : 1.25,
            pb: compact ? 1 : 1.75,
            px: compact ? 1.25 : 1.5,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 800,
              lineHeight: 1.2,
              fontSize: compact ? 14 : 16,
            }}
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
            sx={{ mt: 0.25, fontSize: compact ? 12 : 14 }}
          >
            by {author}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.25, fontSize: compact ? 12 : 14 }}
          >
            Published: {year || 'Unknown'}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: compact ? 0.75 : 1,
            }}
          >
            {showTrendChip && book?.trendLabel ? (
              <Chip
                icon={<TrendingUpIcon />}
                label={book.trendLabel}
                size="small"
                sx={{
                  bgcolor: 'grey.800',
                  color: 'grey.100',
                  fontWeight: 800,
                  height: compact ? 22 : 24,
                  '& .MuiChip-label': { px: compact ? 0.75 : 1, pt: '1px', fontSize: compact ? 11 : 12 },
                }}
              />
            ) : (
              <Box /> 
            )}

            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
              <StarIcon fontSize="small" sx={{ color: 'warning.main' }} />
              <Typography variant="body2" sx={{ fontSize: compact ? 12 : 14 }}>{rating}</Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
