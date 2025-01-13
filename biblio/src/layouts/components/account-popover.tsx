import type { IconButtonProps } from '@mui/material/IconButton';
import { useState, useCallback, useRef } from 'react';
import { SvgColor } from 'src/components/svg-color';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import { useAuth } from 'src/app';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import { _myAccount } from 'src/_mock';

// ----------------------------------------------------------------------

export type AccountPopoverProps = IconButtonProps & {
    data?: {
        label: string;
        href: string;
        icon?: React.ReactNode;
        info?: React.ReactNode;
    }[];
};

export function AccountPopover({ data = [], sx, ...other }: AccountPopoverProps) {
    const navigate = useNavigate();
    const { logout, token, role } = useAuth();

    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    const handleClickItem = useCallback(
        (path: string) => {
            handleClosePopover();
            navigate(path);
        },
        [handleClosePopover, navigate]
    );

    const handleLogoutClick = async () => {
        try {
           const response = await fetch('http://localhost:5000/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

         if (response.ok) {
               logout();
           } else {
                const errorText = await response.text()
                console.error(`Logout error: ${errorText}`);
                alert(`Logout error: ${errorText}`);
             }
        } catch (error) {
         console.error('Error during logout:', error)
         alert(`Logout error: ${error.message}`);
      }
       navigate('/sign-in');
     };
    if (!token) return null;
    const icon = (name: string) => (
        <SvgColor width="24px" height="24px" src={`/assets/icons/navbar/${name}.svg`} />
    );
    const anchorRef = useRef(null);
    return (
        <>
            <IconButton
              ref={anchorRef}
                onClick={handleOpenPopover}
                sx={{
                    p: '2px',
                    width: 40,
                    height: 40,
                    background: (theme) =>
                        `conic-gradient(${theme.vars.palette.primary.light}, ${theme.vars.palette.warning.light}, ${theme.vars.palette.primary.light})`,
                    ...sx,
                }}
                {...other}
            >
                <Avatar src={_myAccount.photoURL} alt={_myAccount.displayName} sx={{ width: 1, height: 1 }}>
                    {_myAccount.displayName.charAt(0).toUpperCase()}
                </Avatar>
            </IconButton>
            <Popover
                open={Boolean(openPopover)}
                anchorEl={openPopover}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                    paper: {
                        sx: { width: 200 },
                    },
                }}
            >
                <Box sx={{ my: 1.5, px: 2.5 }}>
                    <Typography variant="subtitle2" noWrap>
                         {token ? localStorage.getItem('username') : ''}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                         {token ? localStorage.getItem('email') : ''}
                    </Typography>
                     <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                         {token ? role : ''}
                    </Typography>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Stack sx={{ p: 1 }}>
                    <MenuItem onClick={() => {
                        handleClosePopover();
                      
                    }}>
                        Home
                    </MenuItem>
                </Stack>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuItem onClick={handleLogoutClick} sx={{ m: 1 }}>
                    Logout
                </MenuItem>
            </Popover>
        </>
    );
}