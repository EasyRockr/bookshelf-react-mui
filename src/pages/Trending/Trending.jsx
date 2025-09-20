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

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const trRes = await Promise.allSettled([
          olCachedGet('/trending/daily.json', { ttlMs: 5*60*1000 })
        ])

        const trending = trRes[0].status === 'fulfilled'
          ? (trRes[0].value?.data?.works || []).slice(0,12).map(normalizeDoc)
          : []

        const [fic, sci, his, bio] = await Promise.all([
          searchBySubject('fiction', 6,   { ttlMs: 5*60*1000 }),
          searchBySubject('science', 6,   { ttlMs: 5*60*1000 }),
          searchBySubject('history', 3,   { ttlMs: 5*60*1000 }),
          searchBySubject('biography', 3, { ttlMs: 5*60*1000 }),
        ])

        if (!mounted) return
        setData({
          trending,
          fiction: (fic || []).map(normalizeDoc),
          science: (sci || []).map(normalizeDoc),
          histbio: ([...(his || []), ...(bio || [])]).map(normalizeDoc),
        })
      } catch (err) {
        setErrorMessage(err?.message || 'Failed to load')
      } finally {
        if (mounted) setIsLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const open  = (b) => setDialog({ open:true, book:b })
  const close = () => setDialog({ open:false, book:null })

  return (
    <Box sx={pageWrapSx(t)}>
      <Typography variant="h4" sx={pageTitleSx(t)}>Trending Books Today</Typography>

      {isLoading && (
        <>
          <LoadingGrid count={12} />
          {/* replaced <SimpleLoader full /> with skeleton grid */}
        </>
      )}

      {!isLoading && errorMessage && (
        <Typography color="error">{errorMessage}</Typography>
      )}

      {!isLoading && !errorMessage && (
        <>
          <Section title="Trending Today" books={data.trending} onOpen={open} showRanks />
          <Divider sx={{ my: 3 }} />

          <Section title="Popular Fiction" books={data.fiction} onOpen={open} />
          <Divider sx={{ my: 3 }} />

          <Section title="Science & Technology" books={data.science} onOpen={open} />
          <Divider sx={{ my: 3 }} />

          <Section title="History & Biography" books={data.histbio} onOpen={open} />
        </>
      )}

      <BookDialog open={dialog.open} onClose={close} book={dialog.book} />
    </Box>
  )
}
