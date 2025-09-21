import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Box, Grid, TextField, InputAdornment, Button, Typography, Alert } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useTheme } from '@mui/material/styles'
import axios from 'axios'
import { OL_ROOT, qsSerialize, normalizeDoc } from '../../lib/olClient.js'
import LoadingGrid from '../../components/common/LoadingGrid.jsx'
import BookCard from '../../components/catalog/BookCard.jsx'
import BookDialog from '../../components/details/BookDialog.jsx'
import {
  containerSx,
  searchRowBoxSx,
  searchFieldSx,
  searchButtonSx,
  idleWrapperSx,
  idleTitleSx,
  fixedBarSx,
  emptyAlertSx,
  errorAlertSx,
  gridSx,
} from '../../Styles/browse.sx.js'

export default function Browse() {
  const t = useTheme()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('idle') 
  const [rows, setRows] = useState([])
  const [dialog, setDialog] = useState({ open:false, book:null })

  const toolbarMinH =
    (typeof t.mixins.toolbar === 'object' && t.mixins.toolbar?.minHeight)
      ? t.mixins.toolbar.minHeight
      : 64

  const barRef = useRef(null)
  const [barH, setBarH] = useState(88) 

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

  const SearchRow = (
    <Box component="form" onSubmit={onSubmit} sx={searchRowBoxSx}>
      <TextField
        value={q}
        onChange={(e)=>setQ(e.target.value)}
        placeholder="Search for books, authors, or subjects…"
        fullWidth
        sx={searchFieldSx}
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
        variant="outlined"
        color='black'
        sx={searchButtonSx}
      >
        SEARCH
      </Button>
    </Box>
  )

  return (
    <Box sx={{ p: 0 }}>
      {status === 'idle' && (
        <Box sx={idleWrapperSx(toolbarMinH)}>
          <Typography variant="h4" sx={idleTitleSx}>
            Browse Books
          </Typography>
          <Box sx={containerSx}>{SearchRow}</Box>
        </Box>
      )}

      {status !== 'idle' && (
        <>
          <Box ref={barRef} sx={(theme) => fixedBarSx(theme, toolbarMinH)}>
            <Box sx={containerSx}>{SearchRow}</Box>
          </Box>

          <Box sx={{ height: `calc(${barH}px + 16px)` }} />

          {status === 'empty' && (
            <Box sx={{ ...containerSx, mb: 2 }}>
              <Alert severity="info" variant="outlined" sx={emptyAlertSx}>
                No books found. Try a different search term.
              </Alert>
            </Box>
          )}

          {status === 'error' && (
            <Box sx={{ ...containerSx, mb: 2 }}>
              <Alert severity="error" variant="outlined" sx={errorAlertSx}>
                Something went wrong. Please try again.
              </Alert>
            </Box>
          )}
        </>
      )}

      {status === 'loading' && <LoadingGrid count={12} />}
      {status === 'done' && (
        <Grid container spacing={2} sx={gridSx}>
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
