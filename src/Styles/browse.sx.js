export const containerSx = {
  width: { xs: '92vw', sm: '85vw', md: '70vw' },
  maxWidth: 1000,
  mx: 'auto',
  px: 2,
}

export const searchRowBoxSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  my: 0,
}

export const searchFieldSx = {
  flex: 1,
  minWidth: 0,
  '& .MuiInputBase-root': { height: 60 },
  '& input': { fontSize: 14, fontWeight: 600, p: '10px 12px' },
}

export const searchButtonSx = {
  minWidth: 112,
  height: 60,
  px: 3,
  fontSize: 13,
  fontWeight: 800,
}

export const idleWrapperSx = (toolbarMinH) => ({
  height: `calc(100dvh - ${toolbarMinH}px)`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 1.5,
  overflow: 'hidden',
})

export const idleTitleSx = {
  fontWeight: 800,
  m: 0,
  textAlign: 'center',
}

export const fixedBarSx = (theme, toolbarMinH) => ({
  position: 'fixed',
  top: `${toolbarMinH}px`,
  left: 0,
  right: 0,
  zIndex: theme.zIndex.appBar - 1,
  marginTop: 1,
  bgcolor: 'background.default',
  borderBottom: '1px solid',
  borderColor: 'divider',
  py: 1.5,
})

export const emptyAlertSx = {
  alignItems: 'center',
}

export const errorAlertSx = {
  alignItems: 'center',
}

export const gridSx = {
  mt: 0,
  justifyContent: 'center',
}
