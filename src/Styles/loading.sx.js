// Simple spinner styles — no inline sx inside pages/components
export const spinnerRowSx = (t) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  my: 5,
})
export const spinnerFullSx = (t) => ({
  display: 'grid',
  placeItems: 'center',
  minHeight: '40vh',
  width: '100%',
})

export const gridWrapSx = (t) => ({
  justifyContent: 'center',
});