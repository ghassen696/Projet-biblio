import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button, Grid, Paper } from '@mui/material';
import { Worker, Viewer } from '@react-pdf-viewer/core';

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
  const [role, setRole] = useState<string | null>(null); // State to store the user's role

  useEffect(() => {
    // const userRole = localStorage.getItem("role");
    const userRole = "admin";

    setRole(userRole);
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
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);

  const handleOpenPdfViewer = () => setIsPdfViewerOpen(true);
  const handleClosePdfViewer = () => setIsPdfViewerOpen(false);

  return (
    <Box
      sx={{
        padding: 6,
        backgroundColor: '#f9f9f9',
        borderRadius: 3,
        maxWidth: '1200px',
        margin: 'auto',
        boxShadow: 3,
      }}
    >
      {isLoading ? (
        <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
      ) : error ? (
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
      ) : book ? (
        <>
          <Grid container spacing={6} justifyContent="center">
            {/* Book Cover */}
            <Grid item xs={12} md={5}>
              <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <div
                  role="button"  // Make the div interactive
                  onClick={handleOpenPdfViewer}
                  onKeyDown={(e) => e.key === 'Enter' && handleOpenPdfViewer()}
                  tabIndex={0}  // Make the div focusable
                  style={{
                    cursor: 'pointer',  // Makes it clear that the div is clickable
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    position: 'relative', // Ensure proper positioning
                  }}
                >
                  <img
                    src="/assets/background/overlay.jpg"
                    alt={book.Titre}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                    }}
                  />
                </div>
              </Paper>
            </Grid>


            {/* Book Details */}
            <Grid item xs={12} md={7}>
              <Box>
                <Typography variant="h3" gutterBottom color="primary">
                  {book.Titre}
                </Typography>
                <Typography variant="h5" color="textSecondary" gutterBottom>
                  Auteur: {book.Auteur}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Date Edition:</strong> {book.Date_edition || 'N/A'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Editeur:</strong> {book.Editeur || 'N/A'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>ISBN:</strong> {book['ISBN-A'] || 'N/A'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Pages:</strong> {book['Nb Page'] || 'N/A'}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                  {role === 'admin' && (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={openEditModal}
                      >
                        Edit Resource Details
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={openReservationsModal}
                      >
                        Check Reservations
                      </Button>
                    </>
                  )}
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleOpenModal}
                  >
                    Réserver
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Modals */}
          <EditBookModal
            open={isEditModalOpen}
            book={book}
            onClose={closeEditModal}
            onSave={handleSaveChanges}
          />
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
           {isPdfViewerOpen && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
              }}
              onClick={handleClosePdfViewer}
            >
              <iframe
                title="PDF Viewer"
                src="https://docs.google.com/viewer?url=https://uploads.mwp.mprod.getusinfo.com/uploads/sites/82/2022/12/krugman_economie.pdf&embedded=true"
                style={{
                  width: '80%',
                  height: '80%',
                  border: 'none',
                }}
              />
            </Box>
          )}
        </>
      ) : (
        <Typography variant="h6" color="textSecondary" align="center">
          Book not found
        </Typography>
      )}
    </Box>
  );
}  
