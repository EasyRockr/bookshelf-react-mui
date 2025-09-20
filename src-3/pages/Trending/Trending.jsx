// src/pages/Trending/Trending.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, Typography } from '@mui/material';
import { OL_ROOT, qsSerialize, normalizeDoc } from '../../lib/olClient.js';
import LoadingGrid from '../../components/common/LoadingGrid.jsx';
import BookCard from '../../components/catalog/BookCard.jsx';

export default function Trending({ period = 'daily' }) {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    setStatus('loading');
    axios({
      url: `${OL_ROOT}/trending/${period}.json`,
      method: 'GET',
      headers: { Accept: 'application/json' },
      paramsSerializer: (p) => qsSerialize(p),
    })
    .then((response) => {
      const works = response.data?.works ?? [];
      setRows(works.map(normalizeDoc));
      setStatus('done');
    })
    .catch(() => {
      setRows([]);
      setStatus('error');
    });
  }, [period]);

  if (status === 'loading') return <LoadingGrid count={12} />;
  if (status === 'error') return <Typography color="error">Failed to load trending books.</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {rows.map((doc) => {
          const cardProps = { ...doc, doc, book: doc, item: doc, data: doc };
          return (
            <Grid item key={doc.key || doc.id}>
              <BookCard {...cardProps} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
