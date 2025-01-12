import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { varAlpha } from 'src/theme/styles';
import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import IconButton from '@mui/material/IconButton';
import { ChatbotComponent } from './DialogFlowChatbot'; // Importez votre composant Chatbot ici
import { useAuth } from 'src/app';

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
    const { role } = useAuth();
    const navData = data.filter((item) => {
        if (role === 'admin') return true;
      return item.title === 'Resources';
    });

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
      <NavContent data={navData} slots={slots} />
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
    const { role } = useAuth();
    const navData = data.filter((item) => {
        if (role === 'admin') return true;
        return item.title === 'Resources';
    });

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
      <NavContent data={navData} slots={slots} />
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
      <ChatbotComponent />

     
     
    </>
  );
}