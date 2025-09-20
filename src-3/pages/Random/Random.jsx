// src/pages/Random/Random.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, Button, Typography } from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { OL_ROOT, qsSerialize, normalizeDoc } from '../../lib/olClient.js';
import LoadingGrid from '../../components/common/LoadingGrid.jsx';
import BookCard from '../../components/catalog/BookCard.jsx';

const SUBJECTS = ['fiction','science','history','mystery','romance','fantasy','biography','adventure','thriller','comedy','drama','poetry'];

export default function Random() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('idle');
  const [subject, setSubject] = useState('');

  const surprise = () => {
    const s = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
    setSubject(s);
  };

  useEffect(() => {
    if (!subject) return;
    setStatus('loading');
    axios({
      url: `${OL_ROOT}/search.json`,
      method: 'GET',
      params: { subject, limit: 24 },
      headers: { Accept: 'application/json' },
      paramsSerializer: (p) => qsSerialize(p),
    })
    .then((response) => {
      const docs = response.data?.docs ?? [];
      setRows(docs.map(normalizeDoc));
      setStatus(docs.length ? 'done' : 'empty');
    })
    .catch(() => {
      setRows([]);
      setStatus('error');
    });
  }, [subject]);

  return (
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, m: 0 }}>Random Book Discovery</Typography>
      <Typography sx={{ color: 'text.secondary', maxWidth: 480, mx: 'auto', mb: 2 }}>
        Discover new books with our surprise selection
      </Typography>
      <Button variant="contained" size="large" onClick={surprise} sx={{ fontWeight: 800, mb: 2 }}>
        <ShuffleIcon sx={{ mr: 1 }} />
        Surprise me!
      </Button>

      {status === 'idle' && <Typography sx={{ mt: 2 }}>Click “Surprise me!” to start</Typography>}
      {status === 'loading' && <LoadingGrid count={12} />}
      {status === 'error' && <Typography color="error">Failed to load books.</Typography>}
      {status === 'empty' && <Typography>No results for subject: {subject}</Typography>}
      {status === 'done' && (
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          {rows.map((doc) => {
            const cardProps = { ...doc, doc, book: doc, item: doc, data: doc };
            return (
              <Grid item key={doc.key || doc.id}>
                <BookCard {...cardProps} />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
