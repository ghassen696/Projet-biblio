import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useEffect } from 'react';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { varAlpha } from 'src/theme/styles';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: {
    path: string;
    title: string;
    icon: React.ReactNode;
    info?: React.ReactNode;
  }[]; 
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  data,
  slots,
  layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 3.5,
        px: 2,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: 'var(--layout-nav-bg)',
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)})`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavContent data={data} slots={slots} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, open, onClose]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          bgcolor: 'var(--layout-nav-bg)',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, sx }: NavContentProps) {
  const pathname = usePathname();

  // Handle Chatbot Icon Click
  const handleChatbotClick = () => {
    // Logic to open the chatbot, you can integrate any chatbot service here
    console.log('Chatbot opened');
  };

  return (
    <>
      <Logo />

      {slots?.topArea}

      <Scrollbar fillContent>
        <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
          <Box component="ul" gap={0.5} display="flex" flexDirection="column">
            {data.map((item) => {
              const isActive = item.path === pathname;

              return (
                <ListItem disableGutters disablePadding key={item.title}>
                  <ListItemButton
                    disableGutters
                    component={RouterLink}
                    href={item.path}
                    sx={{
                      pl: 2,
                      py: 1.5,
                      gap: 2,
                      pr: 1.5,
                      borderRadius: 1,
                      typography: 'body2',
                      fontWeight: isActive ? 'fontWeightSemiBold' : 'fontWeightMedium',
                      color: isActive ? 'var(--layout-nav-item-active-color)' : 'var(--layout-nav-item-color)',
                      minHeight: 'var(--layout-nav-item-height)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: isActive
                          ? 'var(--layout-nav-item-hover-bg-active)'
                          : 'var(--layout-nav-item-hover-bg)',
                        color: 'var(--layout-nav-item-hover-color)',
                        '& .MuiSvgIcon-root': {
                          transform: 'scale(1.1)',
                        },
                      },
                      ...(isActive && {
                        bgcolor: 'var(--layout-nav-item-active-bg)',
                        color: 'var(--layout-nav-item-active-color)',
                      }),
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 24,
                        height: 24,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Box component="span" flexGrow={1}>
                      {item.title}
                    </Box>

                    {item.info && item.info}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>

      {slots?.bottomArea}

      {/* Floating Chatbot Icon on the Left */}
      <Box sx={{
        position: 'fixed',
        bottom: 20,
        left: 20, // Positioned on the left side
        zIndex: 1000,  // Ensure it's on top
      }}>
        <IconButton
          onClick={handleChatbotClick}
          sx={{
            background: 'linear-gradient(45deg, #FF6F61, #FF8A00, #FFD700)', // Gradient color effect
            color: 'white',
            borderRadius: '50%',
            boxShadow: 2,
            animation: 'backgroundAnimation 6s ease infinite', // Slower animation for smoother transition
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            padding: 1.5, // Smaller size
            width: 50, // Smaller size for the button
            height: 50, // Smaller size for the button
          }}
        >
          {/* Avatar Image as Icon */}
          <img 
            src="assets/images/avatar/avatar-1.webp" 
            alt="Chatbot Avatar" 
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        </IconButton>
      </Box>

      {/* Adding the CSS animation for smooth color change */}
      <style>
        {`
          @keyframes backgroundAnimation {
            0% {
              background: linear-gradient(45deg, #FF6F61, #FF8A00);
            }
            25% {
              background: linear-gradient(45deg, #FF8A00, #FFD700);
            }
            50% {
              background: linear-gradient(45deg, #FFD700, #FF6F61);
            }
            75% {
              background: linear-gradient(45deg, #FF6F61, #FF8A00);
            }
            100% {
              background: linear-gradient(45deg, #FF8A00, #FFD700);
            }
          }
        `}
      </style>
    </>
  );
}
