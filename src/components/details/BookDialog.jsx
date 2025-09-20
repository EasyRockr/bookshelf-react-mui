// src/components/details/BookDialog.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { Modal, Box, Button, Typography, IconButton, Divider, Chip, CircularProgress, Card, CardMedia } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTheme } from '@mui/material/styles'
import axios from 'axios'
import { OL_ROOT } from '../../lib/olClient.js'
import { modalWrapSx, leftPaneSx, leftCardSx, leftMediaSx, rightPaneSx, closeBtnSx, metaRowSx } from '../../Styles/bookDialog.sx.js'
import { divSpace, centerRow, tagRow } from '../../Styles/dialogExtras.sx.js'

const cleanDescription = (desc) => {
  if (!desc) return 'No description available.'
  let text = typeof desc === 'string' ? desc : desc.value || ''

  // Normalize newlines and strip wiki/markdown-ish noise
  text = text.replace(/\r\n|\r|\n/g, ' ').trim()
  text = text.replace(/\[source\][\s\S]*$/gi, ' ').trim()
  text = text.replace(/\[[^\]]+\]\[\d+\]/g, ' ').trim()
  text = text.replace(/^\s*\[\d+\]:\s*\S+(?:\s+\S+)*$/gim, ' ').trim()
  text = text.replace(/\[\d+\]:/g, ' ').trim()
  text = text.replace(/\[([^\]]+)\]\((?:[^)]+)\)/g, '$1')
  text = text.replace(/https?:\/\/\S+/gi, ' ')
  text = text.replace(/[-=]{3,}/g, ' ')
  text = text.replace(/\b(?:Contained in:|See also:)[\s\S]*$/gi, '').trim()
  text = text.replace(/\*+\s*Also\b[:.]?/gi, ' ')
  text = text.replace(/[*_]{1,}/g, ' ')
  text = text.replace(/\s*\[\d+\]\s*/g, ' ')
  text = text.replace(/\(\s*\)|\[\s*\]|\{\s*\}/g, ' ')
  text = text.replace(/[\(\[\{]\s*$/g, ' ')
  text = text.replace(/\bAlso\.?$/i, ' ')
  text = text.replace(/^[\s\.\-:,;\/]+|[\s\.\-:,;\/]+$/g, ' ')
  text = text.replace(/\s+/g, ' ').trim()

  if (!text || text.replace(/[^\w]/g, '').length < 3) return 'No description available.'
  if (!/[.!?]$/.test(text)) text += '.'
  return text
}

export default function BookDialog({ open = false, onClose = () => {}, book = null }) {
  const t = useTheme()
  const [loading, setLoading] = useState(false)
  const [details, setDetails] = useState(null)
  const [showFull, setShowFull] = useState(false)

  useEffect(() => {
    if (!open || !book?.key) return
    setDetails(null)
    setLoading(true)
    axios({
      url: `${OL_ROOT}${book.key}.json`,
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then(res => setDetails(res.data))
      .catch(() => setDetails(null))
      .finally(() => setLoading(false))
  }, [open, book?.key])

  // Build a safe cover src:
  const coverSrc = useMemo(() => {
    if (book?.coverUrl) return book.coverUrl
    const fromBookId = book?.cover_i
    const fromDetailsId = Array.isArray(details?.covers) ? details.covers[0] : null
    const id = fromBookId || fromDetailsId
    return id ? `https://covers.openlibrary.org/b/id/${id}-L.jpg` : null
  }, [book?.coverUrl, book?.cover_i, details?.covers])

  const safeTitle = book?.title || details?.title || 'Untitled'
  const safeAuthor = book?.author || 'Unknown author'
  const safeYear = book?.year || 'Unknown'
  const safeRating = (typeof book?.rating === 'number' && !Number.isNaN(book.rating))
    ? book.rating.toFixed(1)
    : (book?.rating && !Number.isNaN(Number(book.rating)) ? Number(book.rating).toFixed(1) : 'N/A')

  const fullDesc = cleanDescription(details?.description)
  const limit = 300
  const visibleDesc =
    !fullDesc
      ? 'No description available.'
      : showFull || fullDesc.length <= limit
        ? fullDesc
        : fullDesc.slice(0, limit).trimEnd() + '…'

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalWrapSx(t)}>
        <IconButton onClick={onClose} sx={closeBtnSx(t)} aria-label="Close">
          <CloseIcon />
        </IconButton>

        {/* LEFT */}
        <Box sx={leftPaneSx(t)}>
          <Card sx={leftCardSx(t)}>
            {coverSrc ? (
              <CardMedia component="img" image={coverSrc} alt={safeTitle} sx={leftMediaSx(t)} />
            ) : (
              <Box sx={{ ...leftMediaSx(t), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="caption" color="text.secondary">No cover available</Typography>
              </Box>
            )}
          </Card>
        </Box>

        {/* RIGHT */}
        <Box sx={rightPaneSx(t)}>
          {loading && (
            <Box sx={centerRow(t)}>
              <CircularProgress />
            </Box>
          )}

          {!loading && !book && (
            <Box sx={centerRow(t)}>
              <Typography variant="body2" color="text.secondary">No book selected.</Typography>
            </Box>
          )}

          {!loading && book && (
            <>
              <Typography variant="h4" fontWeight={800} gutterBottom>{safeTitle}</Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>{safeAuthor}</Typography>

              <Box sx={metaRowSx(t)}>
                <Typography variant="body2">⭐ {safeRating}</Typography>
                <Typography variant="body2">•</Typography>
                <Typography variant="body2">📅 {safeYear}</Typography>
              </Box>

              <Divider sx={divSpace(t)} />

              <Typography variant="body1" sx={{ mb: 3 }}>
                {visibleDesc}
              </Typography>

              <Button
                size="small"
                onClick={() => setShowFull(v => !v)}
                sx={{ fontWeight: 700, px: 0 }}
              >
                {showFull ? 'Show less' : 'Read more'}
              </Button>

              {!!(details?.subjects?.length) && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>Subjects:</Typography>
                  <Box sx={tagRow(t)}>
                    {details.subjects.slice(0, 10).map((s, i) => (
                      <Chip key={`${s}-${i}`} label={s} variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Modal>
  )
}
