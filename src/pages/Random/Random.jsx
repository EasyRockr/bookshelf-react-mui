import React, { useRef, useState, useLayoutEffect } from 'react'
import { Box, Button, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import LoadingGrid from '../../components/common/LoadingGrid.jsx'
import BookCard from '../../components/catalog/BookCard.jsx'
import BookDialog from '../../components/details/BookDialog.jsx'
import axios from 'axios'
import { OL_ROOT, qsSerialize, normalizeDoc } from '../../lib/olClient.js'

import {
  controlRowBoxSx,
  controlInnerBoxSx,
  heroTitleSx,
  heroSubtitleSx,
  surpriseButtonSx,
  idleWrapperSx,
  fixedBarSx,
  spacerSx,
  errorTextSx,
  emptyTextSx,
  gridSx,
} from '../../Styles/random.sx.js'

const SUBJECTS = [
  'fiction','science','history','mystery','romance',
  'fantasy','biography','adventure','thriller','comedy','drama','poetry'
]

export default function Random() {
  const t = useTheme()
  const idxRef = useRef(0)
  const abortRef = useRef(null)

  const [status, setStatus] = useState('idle')   
  const [rows, setRows] = useState([])
  const [dialog, setDialog] = useState({ open:false, book:null })
  const [lift, setLift] = useState(false)       

  const toolbarMinH =
    (typeof t.mixins.toolbar === 'object' && t.mixins.toolbar?.minHeight)
      ? t.mixins.toolbar.minHeight
      : 64

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

  useLayoutEffect(() => {
    return () => abortRef.current?.abort?.()
  }, [])

  const surprise = () => {
    if (status === 'idle') setLift(true) 
    setStatus('loading')

    const subject = SUBJECTS[idxRef.current % SUBJECTS.length]
    idxRef.current++

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

  const ControlRow = ({ showHeroText = false }) => (
    <Box sx={controlRowBoxSx}>
      <Box sx={controlInnerBoxSx}>
        {showHeroText && (
          <>
            <Typography variant="h4" sx={heroTitleSx}>
              Random Book Discovery
            </Typography>
            <Typography sx={heroSubtitleSx}>
              Discover new books with our surprise selection
            </Typography>
          </>
        )}

        <Button
          variant="contained"
          size="large"
          onClick={surprise}
          sx={surpriseButtonSx(showHeroText)}
        >
          <ShuffleIcon sx={{ mr: 1 }} />
          Surprise me!
        </Button>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ p: 0 }}>
      {(status === 'idle' || lift) && (
        <Box
          onTransitionEnd={() => { if (status !== 'idle') setLift(false) }}
          sx={idleWrapperSx(toolbarMinH, lift)}
        >
          <Typography variant="h4" sx={heroTitleSx}>
            Random Book Discovery
          </Typography>
          <Typography sx={heroSubtitleSx}>
            Discover new books with our surprise selection
          </Typography>
          <ControlRow showHeroText={false} />
        </Box>
      )}

      {status !== 'idle' && !lift && (
        <>
          <Box ref={barRef} sx={(theme) => fixedBarSx(theme, toolbarMinH)}>
            <ControlRow showHeroText />
          </Box>
          <Box sx={(theme) => spacerSx(theme, barH)} />
        </>
      )}

      {status === 'loading' && <LoadingGrid count={12} />}
      {status === 'error'   && (
        <Typography color="error" sx={errorTextSx}>
          Failed to load.
        </Typography>
      )}
      {status === 'empty'   && (
        <Typography sx={emptyTextSx}>
          No books found.
        </Typography>
      )}
      {status === 'done'    && (
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
