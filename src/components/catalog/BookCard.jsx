import React from 'react'
import { Card, CardContent, Typography, Box, Chip, Rating } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import LazyImg from '../common/LazyImg.jsx'
import { CARD_W, CARD_H, IMAGE_H, cardSx } from '../../Styles/bookCard.sx.js'

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

      <CardContent sx={{ flex: 1, p: 1.5, gap: 0.5, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }} noWrap title={book.title}>
          {book.title || 'Untitled'}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap title={book.author}>
          {book.author || 'Unknown'}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 'auto' }}>
          <Rating size="small" precision={0.5} value={Number(book.rating || 0)} readOnly />
          {book.rating ? (
            <Typography variant="caption">{Number(book.rating).toFixed(1)}</Typography>
          ) : (
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>No rating</Typography>
          )}
        </Box>

        {Array.isArray(book.genres) && book.genres.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
            {book.genres.slice(0, 2).map((g) => (
              <Chip key={g} size="small" label={g} />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}