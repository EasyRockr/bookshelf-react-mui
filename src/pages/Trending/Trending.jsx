// src/pages/Trending/Trending.jsx
import React, { useEffect, useState } from 'react'
import { Box, Typography, Divider } from '@mui/material'
import { pageWrapSx, pageTitleSx } from '../../Styles/page.sx.js'
import { useTheme } from '@mui/material/styles'
import Section from '../../components/catalog/Section.jsx'
import BookDialog from '../../components/details/BookDialog.jsx'
import LoadingGrid from '../../components/common/LoadingGrid.jsx'
import axios from 'axios'
import { OL_ROOT, qsSerialize, normalizeDoc } from '../../lib/olClient.js'

export default function Trending() {
  const t = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [dialog, setDialog] = useState({ open:false, book:null })
  const [data, setData] = useState({ trending:[], fiction:[], histbio:[] })

  const open = (b) => setDialog({ open: true, book: b })
  const close = () => setDialog({ open: false, book: null })

  useEffect(() => {
    const ctrl = new AbortController()
    let live = true

    setIsLoading(true)
    setErrorMessage('')

    // Base ordering:
    // Trending Now: fiction
    // Popular Fiction: science
    // History & Biography: history (+ biography top-up)
    const fetchTrendingFromFiction = axios({
      url: `${OL_ROOT}/search.json`,
      method: 'GET',
      params: { subject: 'fiction', limit: 12 },
      headers: { Accept: 'application/json' },
      paramsSerializer: (p) => qsSerialize(p),
      signal: ctrl.signal,
    }).then(r => (r.data?.docs || []).map(normalizeDoc)).catch(() => [])

    const fetchFictionFromScience = axios({
      url: `${OL_ROOT}/search.json`,
      method: 'GET',
      params: { subject: 'science', limit: 12 },
      headers: { Accept: 'application/json' },
      paramsSerializer: (p) => qsSerialize(p),
      signal: ctrl.signal,
    }).then(r => (r.data?.docs || []).map(normalizeDoc)).catch(() => [])

    const fetchHistBio = axios({
      url: `${OL_ROOT}/search.json`,
      method: 'GET',
      params: { subject: 'history', limit: 12 },
      headers: { Accept: 'application/json' },
      paramsSerializer: (p) => qsSerialize(p),
      signal: ctrl.signal,
    })
    .then(async (r) => {
      const hist = (r.data?.docs || []).map(normalizeDoc)
      if (hist.length >= 6) return hist
      const bio = await axios({
        url: `${OL_ROOT}/search.json`,
        method: 'GET',
        params: { subject: 'biography', limit: 12 },
        headers: { Accept: 'application/json' },
        paramsSerializer: (p) => qsSerialize(p),
        signal: ctrl.signal,
      }).then(r2 => (r2.data?.docs || []).map(normalizeDoc)).catch(() => [])
      return [...hist, ...bio].slice(0, 12)
    })
    .catch(() => [])

    Promise.allSettled([fetchTrendingFromFiction, fetchFictionFromScience, fetchHistBio]).then(([tr, fi, hi]) => {
      if (!live) return
      const toList = (res) => res.status === 'fulfilled' ? (res.value || []) : []
      const next = {
        trending: toList(tr),
        fiction: toList(fi),
        histbio: toList(hi),
      }
      const total = next.trending.length + next.fiction.length + next.histbio.length
      if (total === 0) setErrorMessage('Failed to reach the books service. Showing placeholders.')
      setData(next)
      setIsLoading(false)
    }).catch(() => {
      if (!live) return
      setErrorMessage('Failed to reach the books service. Please try again.')
      setIsLoading(false)
    })

    return () => { live = false; ctrl.abort() }
  }, [])

  return (
    <Box sx={pageWrapSx(t)}>
      <Typography variant="h4" sx={pageTitleSx(t)}>
        Trending Books Today
      </Typography>

      {isLoading && <LoadingGrid count={12} animation="pulse" />}

      {!isLoading && (
        <>
          {errorMessage && (
            <Typography color="warning.main" sx={{ textAlign:'center', mb: 2 }}>{errorMessage}</Typography>
          )}

          <Section title="Trending Now" books={data.trending} onOpen={open} />
          <Divider sx={{ my: 3 }} />

          <Section title="Popular Fiction" books={data.fiction} onOpen={open} />
          <Divider sx={{ my: 3 }} />

          <Section title="History & Biography" books={data.histbio} onOpen={open} />
        </>
      )}
      <BookDialog open={dialog.open} onClose={close} book={dialog.book} />
    </Box>
  )
}
