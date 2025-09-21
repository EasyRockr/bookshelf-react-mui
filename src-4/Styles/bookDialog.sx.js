export const modalWrapSx = (t) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '96vw', sm: 700, md: 900 },
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: { xs: 2, sm: 3 },
  maxHeight: '90vh',
  overflow: 'auto',
})

export const leftPaneSx = (t) => ({
  float: 'left',
  width: { xs: '100%', md: 320 },
  mr: { md: 3 },
  mb: { xs: 2, md: 0 },
})

export const leftCardSx = (t) => ({
  borderRadius: 2,
})

export const leftMediaSx = (t) => ({
  width: '100%',
  height: 420,
  objectFit: 'cover',
  borderRadius: 2,
})

export const rightPaneSx = (t) => ({
  overflow: 'hidden',
})

export const closeBtnSx = (t) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  zIndex: 2,
})

export const metaRowSx = (t) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 1,
})
