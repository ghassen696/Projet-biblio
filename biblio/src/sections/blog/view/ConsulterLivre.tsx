/*
import { useState } from 'react';
import { Button, Box } from '@mui/material';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

export  function ConsulterLivre() {
  const [isPdfViewerOpen, setPdfViewerOpen] = useState(false);

  const handleOpenPdfViewer = () => setPdfViewerOpen(true);
  const handleClosePdfViewer = () => setPdfViewerOpen(false);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      height="100vh"
      sx={{ backgroundColor: '#f4f4f4' }} // Fond gris clair
    >
      <Button variant="contained" onClick={handleOpenPdfViewer}>
        Consulter le PDF
      </Button>

      {isPdfViewerOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond sombre pour mettre en valeur le PDF
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 2
          }}
        >
          <Box
            sx={{
              width: '80%',
              height: '90%',
              backgroundColor: 'white',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.10.377/es5/build/pdf.worker.min.js`}>
              <Viewer fileUrl="https://uploads.mwp.mprod.getusinfo.com/uploads/sites/82/2022/12/krugman_economie.pdf" />
            </Worker>
          </Box>

          <Button
            variant="outlined"
            color="error"
            onClick={handleClosePdfViewer}
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              zIndex: 1001,
            }}
          >
            Fermer
          </Button>
        </Box>
      )}
    </Box>
  );
}
*/