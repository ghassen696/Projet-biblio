import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button } from '@mui/material';

interface Book {
  _id: string;
  BIBID: number;
  ITEMID: number;
  Code_barre: string;
  Titre: string;
  Auteur: string;
  Date_edition: string;
  Editeur: string;
  [key: string]: any;
}

export function BookDetailView() {
  const { id } = useParams(); // Get the book ID from the URL
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setIsLoading(true);
      setError(null); // Reset error on new request
      try {
        const response = await fetch(`http://localhost:8000/api/resources_detail/${id}/`);
        if (!response.ok) {
          throw new Error('Book not found or invalid ITEMID');
        }
        const data = await response.json();
        setBook(data); // Set book details from response
      } catch (err) { // Renaming the error variable here
        if (err instanceof Error) {
          setError(err.message); // Set error message if the request fails
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  return (
    <Box sx={{ padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Typography variant="h6" color="error">{error}</Typography> // Display error message
      ) : book ? (
        <>
          <Box sx={{ width: '50%' }}>
            <img
              src="/assets/background/overlay.jpg" // Adjust path if needed
              alt={book.Titre}
              style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
            />
          </Box>
          <Box sx={{ width: '50%', paddingLeft: 4 }}>
            <Typography variant="h4">{book.Titre}</Typography>
            <Typography variant="h6">Auteur: {book.Auteur}</Typography>
            <Typography variant="body1">Date Edition: {book["Date edition"]}</Typography>
            <Typography variant="body1">Editeur: {book.Editeur}</Typography>
            <Typography variant="body1">Cote: {book.Cote}</Typography>
            <Typography variant="body1">ISBN: {book["ISBN-A"]}</Typography>
            <Typography variant="body1">Pages: {book["Nb Page"]}</Typography>
            <Button variant="contained" sx={{ mt: 2 }}>Consult</Button>
          </Box>
        </>
      ) : (
        <Typography variant="h6" color="textSecondary">Book not found</Typography>
      )}
    </Box>
  );
}
