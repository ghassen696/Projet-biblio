import { Typography, Box, Alert } from '@mui/material';
import { useAuth } from 'src/app';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export default function HomePage() {
  const { role, logout } = useAuth();
    const navigate = useNavigate()
  useEffect(() => {
    if(role !== 'admin'){
        alert("You do not have permission to view this page, this page is only for admins");
         navigate('/blog');
    }
  }, [role, navigate])


  return (
    <Box>
        <Typography variant="h4" gutterBottom>
            Dashboard
        </Typography>
        {role === 'admin' && <Typography variant="h5">Welcome to Admin Dashboard</Typography>}
        <button onClick={logout}>Logout</button>
    </Box>
  );
}