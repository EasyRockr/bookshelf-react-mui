export const controlRowBoxSx = {
  display: 'grid',
  placeItems: 'center',
  width: '100%',
  maxWidth: 700,
  mx: 'auto',
  my: 0,
  px: 2,
  gap: 1,
}

export const controlInnerBoxSx = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
}

export const heroTitleSx = {
  fontWeight: 800,
  m: 0,
  textAlign: 'center',
}

export const heroSubtitleSx = {
  color: 'text.secondary',
  textAlign: 'center',
  maxWidth: 400,
}

export const surpriseButtonSx = (showHeroText) => ({
  fontWeight: 800,
  mt: showHeroText ? 1 : 0,
})

export const idleWrapperSx = (toolbarMinH, lift) => ({
  height: `calc(100dvh - ${toolbarMinH}px)`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 1.5,
  overflow: 'hidden',
  transform: lift ? 'translateY(-120%)' : 'translateY(0)',
  transition: 'transform 360ms cubic-bezier(0.4,0,0.2,1)',
})

export const fixedBarSx = (theme, toolbarMinH) => ({
  position: 'fixed',
  top: `${toolbarMinH}px`,
  left: 0,
  right: 0,
  zIndex: theme.zIndex.appBar - 1,
  bgcolor: 'background.default',
  borderBottom: '1px solid',
  borderColor: 'divider',
  py: 1.5,
  display: 'grid',
  placeItems: 'center',
})

export const spacerSx = (theme, barH) => ({
  height: `calc(${barH}px + ${theme.spacing(2)})`,
})

export const errorTextSx = {
  textAlign: 'center',
  mt: 2,
}

export const emptyTextSx = {
  textAlign: 'center',
  mt: 2,
}

export const gridSx = {
  mt: 0,
  px: 2,
  justifyContent: 'center',
}
