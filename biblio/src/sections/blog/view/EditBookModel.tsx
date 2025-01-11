import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid } from '@mui/material';

interface Book {
  _id: string;
  BIBID: number;
  ITEMID: number;
  Code_barre: string;
  Titre: string;
  Auteur: string;
  Date_edition?: string;
  Editeur?: string;
  Cote?: string;
  ["ISBN-A"]?: string;
  ["Nb Page"]?: string;
  D: {
    CREATION: string;
    MODIF: string;
  };
  [key: string]: any;
}

interface EditBookModalProps {
  open: boolean;
  book: Book | null;
  onClose: () => void;
  onSave: (editedBook: Book) => void;
}

export function EditBookModal({ open, book, onClose, onSave }: EditBookModalProps) {
  const [editBook, setEditBook] = useState<Book | null>(book);

  useEffect(() => {
    setEditBook(book); // Update state when book prop changes
  }, [book]);

  const handleInputChange = (field: string, value: string | number) => {
    if (editBook) {
      setEditBook({ ...editBook, [field]: value });
    }
  };

  const handleDFieldChange = (field: keyof Book['D'], value: string) => {
    if (editBook) {
      setEditBook({ ...editBook, D: { ...editBook.D, [field]: value } });
    }
  };

  const handleSave = () => {
    if (editBook) {
      onSave(editBook); // Pass the edited book to the parent
      onClose(); // Close the modal
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Edit Ressources Details</DialogTitle>
      <DialogContent>
        {editBook && (
          <Grid container spacing={2}>
            {/* Render the fields except _id */}
            {Object.keys(editBook)
              .filter((key) => key !== '_id') // Exclude the _id field
              .map((key) => (
                key !== 'D' && (
                  <Grid item xs={12} sm={6} key={key}>
                    <TextField
                      fullWidth
                      label={key}
                      value={editBook[key] || ''}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      margin="normal"
                    />
                  </Grid>
                )
              ))}
            
            {/* Handle the D field as an object */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CREATION"
                value={editBook.D.CREATION || ''}
                onChange={(e) => handleDFieldChange('CREATION', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="MODIF"
                value={editBook.D.MODIF || ''}
                onChange={(e) => handleDFieldChange('MODIF', e.target.value)}
                margin="normal"
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
