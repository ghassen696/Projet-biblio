import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Stack } from '@mui/material';

interface ResourceData {
  BIBID: string;
  ITEMID: string;
  Code_barre: string;
  D_CREATION: string;
  D_MODIF: string;
  Cote: string;
  Inventaire: string;
  Titre: string;
  Auteur: string;
  Staff_Note: string;
  ISBN_A: string;
  Item_class: string;
  Nb_Page: string;
  Date_edition: string;
  Editeur: string;
  Prix: string;
}

interface AddResourceModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddResourceModal({ open, onClose }: AddResourceModalProps) {
  const [resourceData, setResourceData] = useState<ResourceData>({
    BIBID: '',
    ITEMID: '',
    Code_barre: '',
    D_CREATION: '',
    D_MODIF: '',
    Cote: '',
    Inventaire: '',
    Titre: '',
    Auteur: '',
    Staff_Note: '',
    ISBN_A: '',
    Item_class: '',
    Nb_Page: '',
    Date_edition: '',
    Editeur: '',
    Prix: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResourceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/add-resource/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resourceData),
      });

      if (response.ok) {
        onClose();
        alert('Resource added successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to add resource: ${errorData.error}`);
      }
    } catch (error) {
      alert(`Failed to add resource: ${error.message}`);
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setResourceData({
      BIBID: '',
      ITEMID: '',
      Code_barre: '',
      D_CREATION: '',
      D_MODIF: '',
      Cote: '',
      Inventaire: '',
      Titre: '',
      Auteur: '',
      Staff_Note: '',
      ISBN_A: '',
      Item_class: '',
      Nb_Page: '',
      Date_edition: '',
      Editeur: '',
      Prix: '',
    });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Ajouter une Ressource</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Grid container spacing={2}>
            {Object.keys(resourceData).map((key) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  label={key.replace('_', ' ')} // To improve the readability of the field name
                  name={key}
                  variant="outlined"
                  fullWidth
                  value={resourceData[key as keyof ResourceData]}
                  onChange={handleInputChange}
                  style={{ marginBottom: '16px' }}
                />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
