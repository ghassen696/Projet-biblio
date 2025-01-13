import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { useAuth } from 'src/app';
import { Typography, Box, Grid, Paper } from '@mui/material';

// ----------------------------------------------------------------------

export default function HomePage() {
    const { role, logout } = useAuth();
  return (
    <>
      <Helmet>
        <title> {`Dashboard - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>

        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                {role === 'admin' && "Admin Dashboard"}
              {role === 'user' && "User Dashboard"}
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h6">Total Users</Typography>
                        <Typography variant="h4">100</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h6">Total Resources</Typography>
                        <Typography variant="h4">500</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h6">Active Users</Typography>
                        <Typography variant="h4">75</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                         Recent Activity
                        </Typography>
                       <Typography variant="body2">
                           This is a placeholder for recent activities
                           You can add data visualizations here, or other information.
                       </Typography>
                    </Paper>
                </Grid>
                 <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3 }}>
                         <Typography variant="h6" gutterBottom>
                           Quick Actions
                          </Typography>
                        <Typography variant="body2">
                            This section should be used to show actions the user can do, or other useful links.
                         </Typography>
                        </Paper>
                </Grid>
            </Grid>
        </Box>
    </>
  );
}