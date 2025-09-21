export const CARD_W = 180;
export const CARD_H = 320; export const IMAGE_H = 200;
export const cardSx = (t) => ({
    width: CARD_W, height: CARD_H,
    mx: 'auto', display: 'flex', flexDirection: 'column', position: 'relative',
    cursor: 'pointer', bgcolor: 'background.paper', transition: t.transitions.create(['transform', 'box-shadow'],
        { duration: 220 }), '&:hover': { transform: 'translateY(-2px)', boxShadow: t.shadows[8] },
});
export const mediaImgSx = (t) => ({
    height: IMAGE_H, width: '100%', objectFit: 'cover',
    backgroundColor: t.palette.action.hover
}); export const contentSx = (t) => ({ flex: 1, p: 1.5, gap: .5, display: 'flex', flexDirection: 'column' }); export const metaRowSx = (t) => ({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }); export const starRowSx = (t) => ({ display: 'inline-flex', alignItems: 'center', gap: .5 }); export const rankBadgeSx = (t) => ({ position: 'absolute', top: 8, left: 8, background: t.palette.primary.main, color: t.palette.primary.contrastText, px: 1, py: .25, borderRadius: 1, fontWeight: 800, fontSize: 12, boxShadow: t.shadows[3] });
