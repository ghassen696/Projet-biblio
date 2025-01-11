import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button, Grid, Paper } from '@mui/material';
import { EditBookModal } from './EditBookModel'; // Import the modal component
import { ReservationsModal } from './ReservationModal'; // New Reservations Modal component
import ReservationFormModal from "./ReservationFormModal"; // Import du composant ReservationFormModal


interface Book {
  _id: string;
  BIBID: number;
  ITEMID: number;
  Code_barre: string;
  Titre: string;
  Auteur: string;
  Date_edition?: string;
  Editeur?: string;
  ["ISBN-A"]?: string;
  ["Nb Page"]?: string;
  D: {
    CREATION: string;
    MODIF: string;
  };
  [key: string]: any;
}

interface Reservation {
  _id: string;
  user_id: string;
  reservation_date: string;
  return_date: string;
  status: string;
  ITEMID: number;
}

export function BookDetailView() {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [isModalOpen, setModalOpen] = useState(false); // État pour gérer l'ouverture de la modal

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReservationsModalOpen, setIsReservationsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8000/api/resources_detail/${id}/`);
        if (!response.ok) {
          throw new Error('Book not found or invalid ITEMID');
        }
        const data = await response.json();
        setBook(data);

        // Fetch reservations for the book
      
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchBookDetails();
  }, [id]);

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const openReservationsModal = () => {
    setIsReservationsModalOpen(true);
  };

  const closeReservationsModal = () => {
    setIsReservationsModalOpen(false);
  };

  const handleSaveChanges = (editedBook: Book) => {
    setBook(editedBook);
    fetch(`http://localhost:8000/api/resources/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedBook),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update resource');
        }
        return response.json();
      })
      .catch((err) => {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        alert(`Error: ${errorMessage}`);
      });
  };
  const handleOpenModal = () => setModalOpen(true); // Ouvrir la modal
  const handleCloseModal = () => setModalOpen(false); // Fermer la modal
  return (
    <Box sx={{ padding: 4, backgroundColor: '#f4f4f4', borderRadius: 2 }}>
      {isLoading ? (
        <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
      ) : error ? (
        <Typography variant="h6" color="error" align="center">{error}</Typography>
      ) : book ? (
        <>
          <Grid container spacing={4} justifyContent="center">
            {/* Book Cover */}
            <Grid item xs={12} sm={5} md={4}>
              <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
                <img
                  src="/assets/background/overlay.jpg"
                  alt={book.Titre}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </Paper>
            </Grid>

            {/* Book Details */}
            <Grid item xs={12} sm={7} md={6}>
              <Box>
                <Typography variant="h4" gutterBottom>{book.Titre}</Typography>
                <Typography variant="h6" color="textSecondary">Auteur: {book.Auteur}</Typography>
                <Typography variant="body1" color="textPrimary">Date Edition: {book.Date_edition || 'N/A'}</Typography>
                <Typography variant="body1" color="textPrimary">Editeur: {book.Editeur || 'N/A'}</Typography>
                <Typography variant="body1" color="textPrimary">ISBN: {book["ISBN-A"] || 'N/A'}</Typography>
                <Typography variant="body1" color="textPrimary">Pages: {book["Nb Page"] || 'N/A'}</Typography>

                {/* Buttons */}
                <Button
                  variant="contained"
                  sx={{
                    mt: 3,
                    backgroundColor: '#3f51b5',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#303f9f',
                    },
                  }}
                  onClick={openEditModal}
                >
                  Edit Resource Details
                </Button>

                <Button
                  variant="outlined"
                  sx={{
                    mt: 2,
                    ml: 2,
                    color: '#3f51b5',
                    borderColor: '#3f51b5',
                    '&:hover': {
                      borderColor: '#303f9f',
                    },
                  }}
                  onClick={openReservationsModal}
                >
                  Check Reservations
                </Button>
                <Button
              variant="contained"
              sx={{ mt: 2, ml: 2 }}
              onClick={handleOpenModal} // Afficher la modal au clic
            >
              Réserver
            </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Edit Modal */}
          <EditBookModal
            open={isEditModalOpen}
            book={book}
            onClose={closeEditModal}
            onSave={handleSaveChanges}
          />

          {/* Reservations Modal */}
          <ReservationsModal
            open={isReservationsModalOpen}
            onClose={closeReservationsModal}
            ITEMID={book.ITEMID}
          />
          {book && (
        <ReservationFormModal
          book={book}
          open={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
        </>
      ) : (
        <Typography variant="h6" color="textSecondary" align="center">Book not found</Typography>
      )}
    </Box>
  );
}
