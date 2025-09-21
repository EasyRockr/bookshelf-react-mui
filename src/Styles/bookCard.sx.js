export const CARD_W = 180
export const CARD_H = 320
export const IMAGE_H = 200

export const cardSx = (t) => ({
  width: CARD_W,
  height: CARD_H,
  mx: 'auto',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  cursor: 'pointer',
  bgcolor: 'background.paper',
  transition: t.transitions.create(['transform', 'box-shadow'], { duration: 220 }),
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: t.shadows[8],
  },
})

export const contentSx = {
  flex: 1,
  p: 1.5,
  gap: 0.5,
  display: 'flex',
  flexDirection: 'column',
}

export const titleSx = {
  fontWeight: 700,
  lineHeight: 1.2,
}

export const authorSx = {
  color: 'text.secondary',
}

export const starRowSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
  mt: 'auto',
}

export const noRatingSx = {
  color: 'text.disabled',
}

export const genresRowSx = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 0.5,
  mt: 0.5,
}
