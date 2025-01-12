import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Stack,
  Tabs,
  Tab,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';

export function AddResourceCSVModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tabIndex, setTabIndex] = useState(0); // 0 for Single, 1 for Bulk
  const [resourceData, setResourceData] = useState({
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
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedCsvData, setParsedCsvData] = useState<any[]>([]); // to store parsed CSV data

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResourceData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCsvFile(file);
      parseCSV(file); // Parse the CSV file when it's selected
    }
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.split('\n').map((line) => line.trim()).filter((line) => line.length > 0); // Remove empty lines
      const headers = lines[0].split(',');
  
      const data = lines.slice(1).map((line) => {
        const row: { [key: string]: string } = {};
        const values = line.split(',');
  
        // Ensure values align with headers, and handle missing data
        headers.forEach((header, idx) => {
          row[header] = values[idx] !== undefined ? values[idx] : ''; // Assign empty string for missing values
        });
  
        return row;
      });
  
      setParsedCsvData(data);
    };
    reader.readAsText(file);
  };
  

  const handleSubmitSingle = async () => {
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

  const handleSubmitBulk = async () => {
    if (!csvFile) {
      alert('Please select a CSV file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await fetch('http://localhost:8000/api/add-resources-bulk/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        onClose();
        alert('Resources added successfully in bulk!');
        console.log(formData)
      } else {
        const errorData = await response.json();
        alert(`Failed to add resources: ${errorData.error}`);
      }
    } catch (error) {
      alert(`Failed to add resources: ${error.message}`);
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
    setCsvFile(null);
    setParsedCsvData([]);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Ajouter une Ressource</DialogTitle>
      <Tabs value={tabIndex} onChange={(_, newIndex) => setTabIndex(newIndex)} centered>
        <Tab label="Add Single Resource" />
        <Tab label="Add Bulk Resources" />
      </Tabs>
      <DialogContent>
        {tabIndex === 0 ? (
          <Stack spacing={2}>
            <Grid container spacing={2}>
              {Object.keys(resourceData).map((key) => (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    label={key.replace('_', ' ')} // Improve readability
                    name={key}
                    variant="outlined"
                    fullWidth
                    value={resourceData[key as keyof typeof resourceData]}
                    onChange={handleInputChange}
                    style={{ marginBottom: '16px' }}
                  />
                </Grid>
              ))}
            </Grid>
          </Stack>
        ) : (
          <Box>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              style={{ marginBottom: '16px' }}
            />
            {/* Display parsed CSV file content */}
            {parsedCsvData.length > 0 && (
              <Table>
                <TableHead>
                  <TableRow>
                    {Object.keys(parsedCsvData[0]).map((header, idx) => (
                      <TableCell key={idx}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {parsedCsvData.map((row, index) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value, idx) => (
                        <TableCell key={idx}>{value ? value.toString() : ''}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={tabIndex === 0 ? handleSubmitSingle : handleSubmitBulk} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
