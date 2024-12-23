import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { _tasks, _posts, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}/>
        <Grid xs={12} sm={6} md={3}/>
         
        <Grid xs={12} sm={6} md={3}/>
          

        <Grid xs={12} sm={6} md={3}/>
          

        <Grid xs={12} sm={6} md={3}/>
         
         

        <Grid xs={12} md={6} lg={4}/>
          

        <Grid xs={12} md={6} lg={8}/>
          

        <Grid xs={12} md={6} lg={8}/>
          

        <Grid xs={12} md={6} lg={4}/>
          

        <Grid xs={12} md={6} lg={8}/>

        <Grid xs={12} md={6} lg={4}/>

        <Grid xs={12} md={6} lg={4}/>
         

        <Grid xs={12} md={6} lg={8}/>
    </DashboardContent>
  );
}
