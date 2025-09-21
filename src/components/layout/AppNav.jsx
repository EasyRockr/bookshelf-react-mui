import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Menu,
  MenuItem,
  useMediaQuery,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  appBarSx,
  toolbarSx,
  brandWrapSx,
  navRowSx,
  growSx,
  activeLinkSx,
} from '../../Styles/appNav.sx.js';

const NavBtn = ({ to, label, active }) => (
  <Button
    color="inherit"
    component={RouterLink}
    to={to}
    aria-current={active ? 'page' : undefined}
    sx={active ? activeLinkSx : undefined}
  >
    {label}
  </Button>
);

export default function AppNav() {
  const { pathname } = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const navLinks = [
    { to: '/trending', label: 'TRENDING' },
    { to: '/browse', label: 'BROWSE' },
    { to: '/random', label: 'RANDOM' },
    { to: '/about', label: 'ABOUT' },
  ];

  return (
    <>
      <AppBar position="sticky" sx={appBarSx(theme)}>
        <Toolbar sx={toolbarSx(theme)}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleMenuOpen}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box
            component={RouterLink}
            to="/trending"
            sx={brandWrapSx(theme)}
          >
            <MenuBookIcon sx={{ mr: 1 }} />
            <Typography variant="h6">BOOKHUB</Typography>
          </Box>

          {!isMobile && (
            <Box sx={navRowSx(theme)}>
              {navLinks.map((link) => (
                <NavBtn
                  key={link.to}
                  to={link.to}
                  label={link.label}
                  active={pathname === link.to}
                />
              ))}
            </Box>
          )}

          <Box sx={growSx} />
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {navLinks.map((link) => (
          <MenuItem
            key={link.to}
            component={RouterLink}
            to={link.to}
            onClick={handleMenuClose}
            selected={pathname === link.to}
          >
            {link.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
