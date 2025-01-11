import type { BoxProps } from '@mui/material/Box';

import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';


export type LogoProps = BoxProps & {
  href?: string;
  isSingle?: boolean;
  disableLink?: boolean;
};

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    { width, href = '/', height, isSingle = true, disableLink = false, className, sx, ...other },
    ref
  ) => {
    const theme = useTheme();

    const TEXT_PRIMARY = theme.vars.palette.text.primary;
    const PRIMARY_LIGHT = theme.vars.palette.primary.light;
    const PRIMARY_MAIN = theme.vars.palette.primary.main;
    const PRIMARY_DARKER = theme.vars.palette.primary.dark;

    const logoImage = (
      <Box
        alt="Logo"
        component="img"
        src="/assets/icons/navbar/logoihec.jpg"
        width="50%"
        height="85%"
      />
    );

    return (
      <Box
      
        ref={ref}
        component={disableLink ? 'div' : RouterLink}
        to={href}
        sx={{ display: 'inline-block', ...sx ,          paddingBottom: theme.spacing(3), // Adds space below the logo
        }}
        className={className}
        {...other}
      >
        {logoImage}
        <Box sx={{ marginTop: 2, marginBottom:2 }} />
      </Box >
      
    );
  }
);

Logo.displayName = 'Logo';
