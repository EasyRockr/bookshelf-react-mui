import React from 'react'
import { Box, Typography, Chip } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import BookCard from './BookCard.jsx'

export default function Section({
  title,
  books = [],
  onOpen = () => {},
  sixUp = false,
  compact = false,
  tight = false,
}) {
  const labelOf = (b) =>
    b.trendLabel || (typeof b.trendRank === 'number' ? `#${b.trendRank} Trending` : null)

  const ChipOverlay = ({ label }) => (
    <Box sx={{ position: 'absolute', left: 10, bottom: 10, zIndex: 2 }}>
      <Chip
        icon={<TrendingUpIcon />}
        label={label}
        size="small"
        sx={{
          bgcolor: 'grey.800',
          color: 'grey.100',
          fontWeight: 800,
          '& .MuiChip-label': { px: 1 },
        }}
      />
    </Box>
  )


  const columnGap = tight ? 1 : 2       
  const rowGap = tight ? 2 : 3          

  return (
    <Box sx={{ mb: tight ? 1.5 : 2 }}>
      {title && (
        <Typography variant="h6" sx={{ fontWeight: 800, mb: tight ? 1 : 2 }}>
          {title}
        </Typography>
      )}

      {sixUp ? (
        <Box
          sx={{
            display: 'grid',
            columnGap,
            rowGap,
            gridTemplateColumns: {
              xs: 'repeat(1, minmax(0, 1fr))',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(3, minmax(0, 1fr))',
              lg: 'repeat(6, minmax(0, 1fr))',
            },
          }}
        >
          {books.map((b) => {
            const label = labelOf(b)
            return (
              <Box key={b.key || b.id} sx={{ position: 'relative' }}>
                <BookCard
                  book={b}
                  onClick={() => onOpen(b)}
                  fill
                  compact={compact}
                  showTrendChip={false}  /* prevent double chip */
                />
                {label && <ChipOverlay label={label} />}
              </Box>
            )
          })}
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            columnGap,
            rowGap, 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, max-content))',
            justifyContent: 'center',
          }}
        >
          {books.map((b) => (
            <Box key={b.key || b.id} sx={{ position: 'relative' }}>
              <BookCard book={b} onClick={() => onOpen(b)} compact={compact} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
