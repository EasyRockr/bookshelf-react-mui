// src/pages/Browse/Browse.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, TextField, InputAdornment, Button, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { OL_ROOT, qsSerialize, normalizeDoc } from '../../lib/olClient.js';
import LoadingGrid from '../../components/common/LoadingGrid.jsx';
import BookCard from '../../components/catalog/BookCard.jsx';
import BookDialog from '../../components/details/BookDialog.jsx';

export default function Browse() {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | done | empty | error
  const [dialog, setDialog] = useState({ open: false, book: null });
  const [fetchKey, setFetchKey] = useState(0);

  const onSubmit = (e) => {
    e.preventDefault();
    setFetchKey((k) => k + 1);
  };

  useEffect(() => {
    if (!q.trim()) {
      setRows([]);
      setStatus('idle');
      return;
    }
    setStatus('loading');
    axios({
      url: `${OL_ROOT}/search.json`,
      method: 'GET',
      params: { q: q.trim(), limit: 24 },
      headers: { Accept: 'application/json' },
      paramsSerializer: (p) => qsSerialize(p),
    })
    .then((response) => {
      const docs = response.data?.docs ?? [];
      const mapped = docs.map(normalizeDoc);
      setRows(mapped);
      setStatus(mapped.length ? 'done' : 'empty');
    })
    .catch(() => {
      setRows([]);
      setStatus('error');
    });
  }, [fetchKey]);

  return (
    <Box sx={{ p: 2 }}>
      <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        <TextField
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search books"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: '100%', maxWidth: 900 }}
        />
        <Button type="submit" variant="contained">Search</Button>
      </Box>

      {status === 'loading' && <LoadingGrid count={12} />}
      {status === 'error' && <Typography color="error" sx={{ mt: 2 }}>Something went wrong.</Typography>}
      {status === 'empty' && <Typography sx={{ mt: 2 }}>No results.</Typography>}
      {status === 'done' && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {rows.map((doc) => {
            const cardProps = { ...doc, doc, book: doc, item: doc, data: doc };
            return (
              <Grid item key={doc.key || doc.id}>
                <BookCard {...cardProps} onClick={() => setDialog({ open: true, book: doc })} />
              </Grid>
            );
          })}
        </Grid>
      )}

      <BookDialog open={dialog.open} book={dialog.book} onClose={() => setDialog({ open: false, book: null })} />
    </Box>
  );
}
