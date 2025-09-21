import React from 'react'
import { Card, CardContent, Typography, Box, Chip, Rating } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import LazyImg from '../common/LazyImg.jsx'
import {
  IMAGE_H,
  cardSx,
  contentSx,
  titleSx,
  authorSx,
  starRowSx,
  noRatingSx,
  genresRowSx,
} from '../../Styles/bookCard.sx.js'

export default function BookCard({ book, onClick }) {
  const t = useTheme()

  return (
    <Card onClick={onClick} sx={cardSx(t)} elevation={2}>
      <LazyImg
        src={book.coverUrl}
        alt={`${book.title} cover`}
        height={IMAGE_H}
        width="100%"
      />

      <CardContent sx={contentSx}>
        <Typography variant="subtitle2" sx={titleSx} noWrap title={book.title}>
          {book.title || 'Untitled'}
        </Typography>

        <Typography variant="caption" sx={authorSx} noWrap title={book.author}>
          {book.author || 'Unknown'}
        </Typography>

        <Box sx={starRowSx}>
          <Rating
            size="small"
            precision={0.5}
            value={Number(book.rating || 0)}
            readOnly
          />
          {book.rating ? (
            <Typography variant="caption">
              {Number(book.rating).toFixed(1)}
            </Typography>
          ) : (
            <Typography variant="caption" sx={noRatingSx}>
              No rating
            </Typography>
          )}
        </Box>

        {Array.isArray(book.genres) && book.genres.length > 0 && (
          <Box sx={genresRowSx}>
            {book.genres.slice(0, 2).map((g) => (
              <Chip key={g} size="small" label={g} />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
