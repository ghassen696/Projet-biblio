import { useState, ChangeEvent, FormEvent } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Iconify } from 'src/components/iconify';
import QRScanner from 'react-qr-scanner';

export function Sign_In_View() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Sign in form data:', formData); // Log the form data
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      const data = await response.json();
      console.log('Login response data:', data); // Log the response data
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role); // Store user role
      navigate('/'); // Redirect to home page
    } else {
      const errorText = await response.text();
      console.error('Login error:', errorText); // Log the error
      setError(`Error: ${errorText}`);
    }
  };

  const handleScan = (data: string | null) => {
    if (data) {
      console.log('Scanned data:', data);
      navigate('/');
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  const renderForm = (
    <Box component="form" onSubmit={handleSignIn} display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="email"
        label="Email address"
        value={formData.email}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link>

      <TextField
        fullWidth
        name="password"
        label="Password"
        value={formData.password}
        onChange={handleChange}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {error && <Typography color="error" sx={{ mb: 3 }}>{error}</Typography>}

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
      >
        Sign in
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Sign in with QR Code
          <Link variant="subtitle2" sx={{ ml: 0.5 }} onClick={() => setShowQRScanner(!showQRScanner)}>
            Scan here
          </Link>
        </Typography>
      </Box>

      {showQRScanner && (
        <Box display="flex" justifyContent="center" sx={{ mb: 3 }}>
          <QRScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
          />
        </Box>
      )}

      {renderForm}

      <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
        <Link component={RouterLink} to="/register" variant="body2" color="inherit" sx={{ textDecoration: 'none' }}>
          <LoadingButton size="large" color="primary" variant="outlined">
            Create an Account
          </LoadingButton>
        </Link>
      </Box>
    </>
  );
}