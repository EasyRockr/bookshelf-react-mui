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
  const [data, setData] = useState({
    trending: [],
    fiction: [],
    scitech: [],
    histbio: []
  })

  const open = (b) => setDialog({ open: true, book: b })
  const close = () => setDialog({ open: false, book: null })

  useEffect(() => {
    const ctrl = new AbortController()
    let live = true

    setIsLoading(true)
    setErrorMessage('')

    const dedupeByKey = (arr) => {
      const seen = new Set()
      const out = []
      for (const it of arr) {
        const k = it.key || it.id
        if (!k || seen.has(k)) continue
        seen.add(k); out.push(it)
      }
      return out
    }

    const fetchTrendingDaily = axios({
      url: `${OL_ROOT}/trending/daily.json`,
      method: 'GET',
      headers: { Accept: 'application/json' },
      paramsSerializer: (p) => qsSerialize(p),
      signal: ctrl.signal,
    }).then(r => (r.data?.works || []).slice(0, 12).map(normalizeDoc))
      .catch(() => [])

    const fetchPopularFiction = axios({
      url: `${OL_ROOT}/search.json`,
      method: 'GET',
      params: { subject: 'fiction', limit: 12 },
      headers: { Accept: 'application/json' },
      paramsSerializer: (p) => qsSerialize(p),
      signal: ctrl.signal,
    }).then(r => (r.data?.docs || []).map(normalizeDoc))
      .catch(() => [])

    const fetchScience = axios({
      url: `${OL_ROOT}/search.json`,
      method: 'GET',
      params: { subject: 'science', limit: 12 },
      headers: { Accept: 'application/json' },
      paramsSerializer: (p) => qsSerialize(p),
      signal: ctrl.signal,
    }).then(r => (r.data?.docs || []).map(normalizeDoc))
      .catch(() => [])

    const fetchTechnology = axios({
      url: `${OL_ROOT}/search.json`,
      method: 'GET',
      params: { subject: 'technology', limit: 12 },
      headers: { Accept: 'application/json' },
      paramsSerializer: (p) => qsSerialize(p),
      signal: ctrl.signal,
    }).then(r => (r.data?.docs || []).map(normalizeDoc))
      .catch(() => [])

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

    Promise.allSettled([
      fetchTrendingDaily,
      fetchPopularFiction,
      fetchScience,
      fetchTechnology,
      fetchHistBio
    ]).then(([tr, fi, sci, tech, hi]) => {
      if (!live) return
      const toList = (res) => res.status === 'fulfilled' ? (res.value || []) : []

      const trending = toList(tr).map((b, i) => ({
        ...b,
        trendRank: i + 1,
        trendLabel: `#${i + 1} Trending`,
      }))

      const scitech = dedupeByKey([...toList(sci), ...toList(tech)]).slice(0, 12)

      setData({
        trending,
        fiction: toList(fi),
        scitech,
        histbio: toList(hi),
      })
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
        <Section title="Trending Now"          books={data.trending} onOpen={open} sixUp compact tight />
        <Divider sx={{ my: 3 }} />

        <Section title="Popular Fiction"       books={data.fiction}  onOpen={open} sixUp compact tight />
        <Divider sx={{ my: 3 }} />

        <Section title="Science & Technology"  books={data.scitech}  onOpen={open} sixUp compact tight />
        <Divider sx={{ my: 3 }} />

        <Section title="History & Biography"   books={data.histbio}  onOpen={open} sixUp compact tight />
      </>
      )}
      <BookDialog open={dialog.open} onClose={close} book={dialog.book} />
    </Box>
  )
}
