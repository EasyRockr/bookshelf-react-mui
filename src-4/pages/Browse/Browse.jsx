// src/pages/Browse/Browse.jsx
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Box, Grid, TextField, InputAdornment, Button, Typography, Alert } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useTheme } from '@mui/material/styles'
import axios from 'axios'
import { OL_ROOT, qsSerialize, normalizeDoc } from '../../lib/olClient.js'
import SimpleLoader from '../../components/common/SimpleLoader.jsx'
import LoadingGrid from '../../components/common/LoadingGrid.jsx'
import BookCard from '../../components/catalog/BookCard.jsx'
import BookDialog from '../../components/details/BookDialog.jsx'

export default function Browse() {
  const t = useTheme()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | done | empty | error
  const [rows, setRows] = useState([])
  const [dialog, setDialog] = useState({ open:false, book:null })

  // AppBar/Toolbar height (fallback 64)
  const toolbarMinH =
    (typeof t.mixins.toolbar === 'object' && t.mixins.toolbar?.minHeight)
      ? t.mixins.toolbar.minHeight
      : 64

  // Measure fixed search bar so content starts below it
  const barRef = useRef(null)
  const [barH, setBarH] = useState(88) // safe default so there's space on first paint

  useLayoutEffect(() => {
    if (status === 'idle' || !barRef.current) return
    const el = barRef.current
    const update = () => setBarH(el.offsetHeight || 88)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [status])

  const onSubmit = (e) => {
    e.preventDefault()
    if (!q.trim()) return
    setStatus('loading')

    axios({
      url: `${OL_ROOT}/search.json`,
      method: 'GET',
      params: { q: q.trim(), limit: 24 },
      headers: { Accept: 'application/json' },
      paramsSerializer: (p) => qsSerialize(p),
    })
      .then(res => {
        const list = (res.data.docs || []).slice(0,24).map(normalizeDoc)
        setRows(list)
        setStatus(list.length ? 'done' : 'empty')
      })
      .catch(() => setStatus('error'))
  }

  // Shared container so search row and info bar are perfectly parallel
  const containerSx = {
    width: { xs: '92vw', sm: '85vw', md: '70vw' },
    maxWidth: 1000,
    mx: 'auto',
    px: 2,
  }

  // Shared search row (inner content doesn't set width; parent does)
  const SearchRow = (
    <Box component="form" onSubmit={onSubmit}
      sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 0 }}>
      <TextField
        value={q}
        onChange={(e)=>setQ(e.target.value)}
        placeholder="Search for books, authors, or subjects…"
        fullWidth
        sx={{
          flex: 1,
          minWidth: 0,
          '& .MuiInputBase-root': { height: 60 },
          '& input': { fontSize: 14, fontWeight: 600, p: '10px 12px' },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon/>
            </InputAdornment>
          ),
        }}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{ minWidth: 112, height: 60, px: 3, fontSize: 13, fontWeight: 800 }}
      >
        SEARCH
      </Button>
    </Box>
  )

  return (
    <Box sx={{ p: 0 }}>
      {status === 'idle' && (
        <Box
          sx={{
            height: `calc(100dvh - ${toolbarMinH}px)`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1.5,
            overflow: 'hidden',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, m: 0, textAlign: 'center' }}>
            Browse Books
          </Typography>
          <Box sx={containerSx}>{SearchRow}</Box>
        </Box>
      )}

      {status !== 'idle' && (
        <>
          <Box
            ref={barRef}
            sx={(theme) => ({
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
            })}
          >
            <Box sx={containerSx}>{SearchRow}</Box>
          </Box>

          <Box sx={{ height: `calc(${barH}px + 16px)` }} />

          {status === 'empty' && (
            <Box sx={{ ...containerSx, mb: 2 }}>
              <Alert severity="info" variant="outlined" sx={{ alignItems: 'center' }}>
                No books found. Try a different search term.
              </Alert>
            </Box>
          )}

          {status === 'error' && (
            <Box sx={{ ...containerSx, mb: 2 }}>
              <Alert severity="error" variant="outlined" sx={{ alignItems: 'center' }}>
                Something went wrong. Please try again.
              </Alert>
            </Box>
          )}
        </>
      )}

      {status === 'loading' && <LoadingGrid count={12} />}
      {status === 'done' && (
        <Grid container spacing={2} sx={{ mt: 0, justifyContent: 'center' }}>
          {rows.map((b) => (
            <Grid item key={b.key || b.id}>
              <BookCard book={b} onClick={() => setDialog({ open: true, book: b })} />
            </Grid>
          ))}
        </Grid>
      )}

      <BookDialog
        open={dialog.open}
        onClose={() => setDialog({ open: false, book: null })}
        book={dialog.book}
      />
    </Box>
  )
}
