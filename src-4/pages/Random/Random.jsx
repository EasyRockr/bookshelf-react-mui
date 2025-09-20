// src/pages/Random/Random.jsx
import React, { useRef, useState, useLayoutEffect } from 'react'
import { Box, Button, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import LoadingGrid from '../../components/common/LoadingGrid.jsx'
import BookCard from '../../components/catalog/BookCard.jsx'
import BookDialog from '../../components/details/BookDialog.jsx'
import axios from 'axios'
import { OL_ROOT, qsSerialize, normalizeDoc } from '../../lib/olClient.js'

const SUBJECTS = ['fiction','science','history','mystery','romance','fantasy','biography','adventure','thriller','comedy','drama','poetry']

export default function Random() {
  const t = useTheme()
  const idxRef = useRef(0)
  const abortRef = useRef(null)

  // UI state
  const [status, setStatus] = useState('idle')   // idle | loading | done | empty | error
  const [rows, setRows] = useState([])
  const [dialog, setDialog] = useState({ open:false, book:null })
  const [lift, setLift] = useState(false)        // slide-up hero on first click

  // AppBar height (fallback 64)
  const toolbarMinH =
    (typeof t.mixins.toolbar === 'object' && t.mixins.toolbar?.minHeight)
      ? t.mixins.toolbar.minHeight
      : 64

  // Fixed control bar measurement
  const barRef = useRef(null)
  const [barH, setBarH] = useState(72)
  useLayoutEffect(() => {
    if (status === 'idle' || !barRef.current) return
    const el = barRef.current
    const update = () => setBarH(el.offsetHeight || 72)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [status])

  // Abort any in-flight request on unmount
  useLayoutEffect(() => {
    return () => abortRef.current?.abort?.()
  }, [])

  const surprise = () => {
    if (status === 'idle') setLift(true) // start slide-up on first click
    setStatus('loading')

    const subject = SUBJECTS[idxRef.current % SUBJECTS.length]
    idxRef.current++

    // cancel stale
    abortRef.current?.abort?.()
    abortRef.current = new AbortController()

    axios({
      url: `${OL_ROOT}/search.json`,
      method: 'GET',
      params: { subject, limit: 12 },
      headers: { Accept: 'application/json' },
      paramsSerializer: (p) => qsSerialize(p),
      signal: abortRef.current.signal,
    })
      .then(res => {
        const list = (res.data?.docs || []).map(normalizeDoc)
        setRows(list)
        setStatus(list.length ? 'done' : 'empty')
      })
      .catch(() => setStatus('error'))
  }

  // Centered control row (button), with optional hero title/subtitle above the button.
  const ControlRow = ({ showHeroText = false }) => (
    <Box
      sx={{
        display: 'grid',
        placeItems: 'center',
        width: '100%',
        maxWidth: 700,
        mx: 'auto',
        my: 0,
        px: 2,
        gap: 1,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        {showHeroText && (
          <>
            <Typography variant="h4" sx={{ fontWeight: 800, m: 0, textAlign: 'center' }}>
              Random Book Discovery
            </Typography>
            <Typography sx={{ color: 'text.secondary', textAlign: 'center', maxWidth: 400 }}>
              Discover new books with our surprise selection
            </Typography>
          </>
        )}

        <Button variant="contained" size="large" onClick={surprise} sx={{ fontWeight: 800, mt: showHeroText ? 1 : 0 }}>
          <ShuffleIcon sx={{ mr: 1 }} />
          Surprise me!
        </Button>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ p: 0 }}>
      {/* --- HERO (mounted until the slide finishes) --- */}
      {(status === 'idle' || lift) && (
        <Box
          onTransitionEnd={() => { if (status !== 'idle') setLift(false) }}
          sx={{
            height: `calc(100dvh - ${toolbarMinH}px)`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1.5,
            overflow: 'hidden',
            transform: lift ? 'translateY(-120%)' : 'translateY(0)',
            transition: 'transform 360ms cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, m: 0, textAlign: 'center' }}>
            Random Book Discovery
          </Typography>
          <Typography sx={{ color: 'text.secondary', textAlign: 'center', maxWidth: 400 }}>
            Discover new books with our surprise selection
          </Typography>
          <ControlRow showHeroText={false} />
        </Box>
      )}

      {/* --- FIXED CONTROL BAR (appears after hero slides out) --- */}
      {status !== 'idle' && !lift && (
        <>
          <Box
            ref={barRef}
            sx={(theme) => ({
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
            })}
          >
            {/* Title + subtitle above the button */}
            <ControlRow showHeroText />
          </Box>
          {/* Spacer for the fixed bar */}
          <Box sx={(theme) => ({ height: `calc(${barH}px + ${theme.spacing(2)})` })} />
        </>
      )}

      {/* RESULTS */}
      {status === 'loading' && <LoadingGrid count={12} />}
      {status === 'error'   && (
        <Typography color="error" sx={{ textAlign: 'center', mt: 2 }}>
          Failed to load.
        </Typography>
      )}
      {status === 'empty'   && (
        <Typography sx={{ textAlign: 'center', mt: 2 }}>
          No books found.
        </Typography>
      )}
      {status === 'done'    && (
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 0, px: 2 }}>
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
