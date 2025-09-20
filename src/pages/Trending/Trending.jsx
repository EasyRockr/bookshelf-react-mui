import React, { useEffect, useState } from 'react'
import { Box, Typography, Divider } from '@mui/material'
import { pageWrapSx, pageTitleSx } from '../../Styles/page.sx.js'
import { useTheme } from '@mui/material/styles'
import Section from '../../components/catalog/Section.jsx'
import BookDialog from '../../components/details/BookDialog.jsx'
import SimpleLoader from '../../components/common/SimpleLoader.jsx'
import LoadingGrid from '../../components/common/LoadingGrid.jsx'
import { olCachedGet, normalizeDoc, searchBySubject } from '../../lib/olClient.js'

export default function Trending() {
  const t = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [dialog, setDialog] = useState({ open:false, book:null })
  const [data, setData] = useState({ trending:[], fiction:[], science:[], histbio:[] })

  const open = (b) => setDialog({ open: true, book: b })
  const close = () => setDialog({ open: false, book: null })

  useEffect(() => {
    const ctrl = new AbortController()
    let live = true

    async function load() {
      setIsLoading(true)
      setErrorMessage('')

      const opts = { ttlMs: 10*60*1000, staleMs: 24*60*60*1000, signal: ctrl.signal }

      const jobs = [
        searchBySubject('fiction', 12, opts),
        searchBySubject('science', 12, opts),
        searchBySubject('history', 12, opts).then(h => {
          return h.length >= 6 ? h : searchBySubject('biography', 12, opts).then(b => [...h, ...b].slice(0,12))
        }),
      ]

      try {
        const [tr, fi, hi] = await Promise.allSettled(jobs)
        const toList = (r) => r.status === 'fulfilled' ? (r.value || []).map(normalizeDoc) : []

        const next = {
          trending: toList(tr),
          fiction:  toList(fi),
          science:  [], // not used separately in this variant
          histbio:  toList(hi),
        }

        if (live) {
          const total = next.trending.length + next.fiction.length + next.histbio.length
          if (total === 0) {
            setErrorMessage('Failed to reach the books service. Showing placeholders.')
          }
          setData(next)
          setIsLoading(false)
        }
      } catch (e) {
        if (live) {
          setErrorMessage('Failed to reach the books service. Please try again.')
          setIsLoading(false)
        }
      }
    }

    load()
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
