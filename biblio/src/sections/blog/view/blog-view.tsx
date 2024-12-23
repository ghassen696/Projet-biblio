import { Box, Button, Grid, Typography, Pagination } from '@mui/material';
import { _books } from 'src/_mock/_books';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function BlogView() {
  return (
    <DashboardContent>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Ressources
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Ajouter une Ressource
        </Button>
      </Box>

      {/* Books Grid */}
      <Grid container spacing={3}>
        {_books.map((book) => (
          <Grid key={book.id} xs={10} sm={6} md={3}>
            <Box
              sx={{
                p: 2,
                border: '2px solid #ddd',
                borderRadius: 2,
                backgroundColor: '#f9f9f9',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                height: '350px',
                margin: '5px', // Espacement entre les livres

              }}
            >
              <Box
                component="img"
                src={book.coverUrl}
                alt={book.title}
                sx={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: 1,
                }}
              />
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                {book.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Auteur: {book.author.length > 20 ? `${book.author.slice(0, 20)}...` : book.author}
              </Typography>

              <Typography variant="body2" color="textSecondary">
                Localisation: {book.location}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Date: {new Date(book.date).toLocaleDateString()}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Pagination count={10} color="primary" sx={{ mt: 8, mx: 'auto' }} />
    </DashboardContent>
  );
}
