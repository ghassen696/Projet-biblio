import { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography, Pagination, TextField, MenuItem, Select, InputLabel, FormControl, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { AddResourceCSVModal } from './AddResourceModal';

interface Book {
  _id: string;
  BIBID: number;  
  ITEMID: number; 
  Code_barre: string;
  Titre: string;
  Auteur: string; 
  "Date edition"?: string; 
  Editeur: string;  
}

export function BlogView() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);  // Show 12 cards per page
  const [isLoading, setIsLoading] = useState(false);
  const [totalBooks, setTotalBooks] = useState(0);
  const navigate = useNavigate();  // Initialize useNavigate hook
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);

      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('titre', searchTerm); 
      if (authorFilter) queryParams.append('auteur', authorFilter);  
      if (sortOrder) queryParams.append('sort', sortOrder);  
      queryParams.append('page', page.toString());
      queryParams.append('page_size', pageSize.toString());

      try {
        const response = await fetch(`http://localhost:8000/api/library_resources/?${queryParams.toString()}`);
        const data = await response.json();
        console.log(data);

        if (data.results) {
          setBooks(data.results);  // Set books data
          setTotalBooks(data.count);  // Set total number of books for pagination
        } else {
          setBooks([]);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
        setBooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [searchTerm, authorFilter, sortOrder, page, pageSize]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setAuthorFilter('');
    setSortOrder('');
    setPage(1);
  };

  const handleCardClick = (book: Book) => {
    console.log(book.ITEMID); // Log to check if _id exists
    navigate(`/book/${book.ITEMID}`);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <DashboardContent>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>Ressources</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenModal}  // Open the modal when clicked
        >
          Ajouter une Ressource
        </Button>
        <AddResourceCSVModal
        open={openModal}   // Pass the open state as prop
        onClose={handleCloseModal}  // Pass the close function as prop
      />
      </Box>

      {/* Filters and Search Box */}
      <Box display="flex" gap={2} mb={3} alignItems="center">
        <TextField label="Search by Titre" variant="outlined" fullWidth value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Author</InputLabel>
          <Select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} label="Author">
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="Paul R. Krugman">Paul R. Krugman</MenuItem>
            <MenuItem value="Maurice Obstfeld">Maurice Obstfeld</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} label="Sort By">
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="asc">Date Ascending</MenuItem>
            <MenuItem value="desc">Date Descending</MenuItem>
          </Select>
        </FormControl>

        {/* Reset Filters Button */}
        <Button variant="outlined" onClick={handleResetFilters}>
          Reset Filters
        </Button>
      </Box>

      {/* Cards Grid */}
      <Grid container spacing={3}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : books.length > 0 ? (
          books.map((book) => (
            <Grid key={book._id} item xs={12} sm={6} md={3}>
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
                  margin: '5px',
                  cursor: 'pointer'  // Make the card clickable
                }}
                onClick={() => handleCardClick(book)}  // Redirect on card click
              >
                <Box component="img"  src="assets/background/overlay.jpg" alt={book.BIBID.toString()} sx={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 1 }} />
                <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                  {book.Titre.length > 15 ? `${book.Titre.slice(0, 15)}...` : book.Titre}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Auteur: {book.Auteur.length > 13 ? `${book.Auteur.slice(0, 13)}...` : book.Auteur}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Editeur: {book.Editeur.length > 13 ? `${book.Editeur.slice(0, 13)}...` : book.Editeur}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Date Edition: {book["Date edition"] || 'Not Available' }
                </Typography>
              </Box>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" color="textSecondary">No books available</Typography>
        )}
      </Grid>

      {/* Pagination */}
      {books.length > 0 && (
        <Pagination
          count={Math.ceil(totalBooks / pageSize)}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
          color="primary"
          sx={{ mt: 8, mx: 'auto' }}
        />
      )}
    </DashboardContent>
  );
}
