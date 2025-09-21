import React from 'react'
import { Box, Typography, Chip } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import BookCard from './BookCard.jsx'

/**
 * Props:
 * - sixUp: forces 6 columns at lg+ using CSS grid; cards fill cells
 * - compact: pass to card for shorter height & smaller text
 * - tight: smaller gaps/section spacing
 */
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

  // Column and row gaps are independent now
  const columnGap = tight ? 1 : 2        // horizontal space
  const rowGap = tight ? 2 : 3           // vertical space (bigger than columns)

  return (
    <Box sx={{ mb: tight ? 1.5 : 2 }}>
      {title && (
        <Typography variant="h6" sx={{ fontWeight: 800, mb: tight ? 1 : 2 }}>
          {title}
        </Typography>
      )}

      {sixUp ? (
        /* Guaranteed 6-up at lg+, cards fill each column; overlay chip to match prof UI */
        <Box
          sx={{
            display: 'grid',
            columnGap,
            rowGap, // 👈 extra space between rows
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
        /* Random.jsx look: centered, fixed-width cards; footer chip stays inside the card */
        <Box
          sx={{
            display: 'grid',
            columnGap,
            rowGap, // 👈 extra space between rows
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
