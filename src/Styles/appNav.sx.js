export const appBarSx = (t) => ({
  boxShadow: t.shadows[2],
  backgroundColor: t.palette.background.paper,
  color: t.palette.text.primary,
});

export const toolbarSx = (t) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 1,
  px: 2,
});

export const brandWrapSx = (t) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 0.75,
  textDecoration: 'none',
  color: 'inherit',
  [t.breakpoints.down('md')]: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

export const navRowSx = (t) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  [t.breakpoints.down('md')]: {
    display: 'none', 
  },
});

export const growSx = {
  flexGrow: 1,
};

export const activeLinkSx = {
  textDecoration: 'underline',
  textUnderlineOffset: '4px',
};
