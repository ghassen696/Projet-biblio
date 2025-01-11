import { Typography, Box } from '@mui/material';
import { useAuth } from 'src/app';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserPage() {
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
        User Management
      </Typography>
        {role === 'admin' &&  <Typography>This is the user management page for admins.</Typography>}
        <button onClick={logout}>Logout</button>
    </Box>
  );
}