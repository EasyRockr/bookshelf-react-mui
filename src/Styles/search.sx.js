export const searchRowSx = (t) => ({
  display: 'flex',
  flexWrap: 'nowrap',
  alignItems: 'center',
  justifyContent: 'center',
  gap: t.spacing(1),
  my: 6,
  px: 2,
});

export const searchInputSx = (t) => ({
  width: '100%',
  maxWidth: 520,
  [t.breakpoints.down('md')]: { maxWidth: 420 },
  [t.breakpoints.down('sm')]: { maxWidth: 300 },
  '& .MuiInputBase-root': { height: 'var(--search-h, 60px)' },
  '& input': {
    fontSize: 14,
    fontWeight: 600,
    padding: '10px 12px',
  },
});


export const searchBtnSx = (t) => ({
  minWidth: 96,
  height: 60,       
  px: 2.5,
  fontSize: 13,
  fontWeight: 800,
});
