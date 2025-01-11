import { useState, ChangeEvent, FormEvent } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';

export default function RegisterView() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user' // Default role is 'user'
  });
  const [emailError, setEmailError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(ucar|u-manouba|utm)\.tn$/;
    if (!emailRegex.test(formData.email)) {
      setEmailError('Invalid email format. Must be something@something.(ucar|u-manouba|utm).tn');
      return;
    }
    setEmailError('');

    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
        navigate('/sign-in');
    } else {
      const errorText = await response.text();
      alert(`Error registering user: ${errorText}`);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h5" sx={{ mb: 3 }}>Create an Account</Typography>
      <TextField
        fullWidth
        name="username"
        label="Username"
        value={formData.username}
        onChange={handleChange}
        sx={{ mb: 3 }}
      />
      <TextField
        fullWidth
        name="email"
        label="Email"
        value={formData.email}
        onChange={handleChange}
        error={!!emailError}
        helperText={emailError}
        sx={{ mb: 3 }}
      />
      <TextField
        fullWidth
        name="password"
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        sx={{ mb: 3 }}
      />
      <TextField
        select
        fullWidth
        name="role"
        label="Role"
        value={formData.role}
        onChange={handleChange}
        sx={{ mb: 3 }}
      >
        <MenuItem value="user">User</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
      </TextField>
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="primary"
        variant="contained"
      >
        Register
      </LoadingButton>
      {message && <Typography color="success" sx={{ mt: 3 }}>{message}</Typography>}
    </Box>
  );
}