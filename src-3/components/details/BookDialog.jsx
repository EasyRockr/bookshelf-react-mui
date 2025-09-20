// src/components/details/BookDialog.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, Typography, Box } from '@mui/material';
import { OL_ROOT, qsSerialize } from '../../lib/olClient.js';

export default function BookDialog({ open, book, onClose }) {
  const [details, setDetails] = useState(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!open || !book?.key) {
      setDetails(null);
      setStatus('idle');
      return;
    }
    setStatus('loading');
    const path = book.key.startsWith('/') ? book.key : `/${book.key}`;
    axios({
      url: `${OL_ROOT}${path}.json`,
      method: 'GET',
      headers: { Accept: 'application/json' },
      paramsSerializer: (p) => qsSerialize(p),
    })
    .then((response) => {
      setDetails(response.data);
      setStatus('done');
    })
    .catch(() => {
      setDetails(null);
      setStatus('error');
    });
  }, [open, book?.key]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{book?.title || 'Book Details'}</DialogTitle>
      <DialogContent dividers>
        {status === 'loading' && <Typography>Loading…</Typography>}
        {status === 'error' && <Typography color="error">Failed to load details.</Typography>}
        {status === 'done' && details && (
          <Box>
            <Typography variant="subtitle1">Key: {details.key}</Typography>
            {details.description && (
              <Typography sx={{ mt: 1 }}>
                {typeof details.description === 'string'
                  ? details.description
                  : details.description?.value}
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
