import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, useMediaQuery, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Header() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  


  useEffect(() => {
  fetch('http://localhost:8001/api/user/me', {
    method: 'GET',
    credentials: 'include', // This sends cookies!
  })
    .then(res => res.json())
    .then(data => {
      if (data && data.success) {
        setIsLoggedIn(true);
        setUser(data.user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    })
    .catch(() => {
      setIsLoggedIn(false);
      setUser(null);
    });
}, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  const handleLogout = async () => {
    try{
      const response = await fetch(`http://localhost:8001/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        credentials: 'include'
      });
      if (response.ok){
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
        navigate('/login');
      }
    }catch (error){
      console.log(error);
    }
  }
    return (
    <AppBar position="static" sx={{ bgcolor: 'background.paper', position: 'fixed', zIndex: '999' }}>
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AI English Tutor
          </Typography>
        </motion.div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {isLoggedIn ? (
              <>
                <Button
                  variant="text"
                  startIcon={<AccountCircleIcon />}
                  onClick={() => handleNavigation('/profile')}
                  sx={{
                    borderRadius: 2,
                    color: theme.palette.text.secondary,
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: 'transparent',
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {user?.profileName || 'User Profile'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleLogout}
                  sx={{ borderRadius: 2 }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={() => handleNavigation('/login')}
                  sx={{ borderRadius: 2 }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleNavigation('/register')}
                  sx={{ borderRadius: 2 }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        )}

        {/* Mobile Navigation */}
        {isMobile && (
          <>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleMenuOpen}
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{ sx: { minWidth: 150 } }}
            >
              {isLoggedIn ? (
                <>
                  <MenuItem onClick={() => handleNavigation('/profile')}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </>
              ) : (
                <>
                  <MenuItem onClick={() => handleNavigation('/login')}>Login</MenuItem>
                  <MenuItem onClick={() => handleNavigation('/register')}>Sign Up</MenuItem>
                </>
              )}
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}