import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  useTheme
  
} from '@mui/material';
import { motion } from 'framer-motion';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

export default function ForgotPassword() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await fetch(`http://localhost:8001/api/auth/send-forgot-password-code`,{
          method: 'PATCH',
          headers: {
            "Content-Type" : "application/json"
          },
          body: JSON.stringify({email})
        });
        const data = await response.json();
        console.log(data);
        if (response.ok || data.data) {
          setSnackbarOpen(true);
          setTimeout(() => navigate('/reset-password'), 3000);
          }
      } catch (error) {
        console.error(error);
      }
    // navigate('/login'); 
  };

  return (
    
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <MuiAlert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Code sent to your mail! Navigating...
        </MuiAlert>
      </Snackbar>
      <Container maxWidth="xs" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ 
            mt: 8,
            p: 4,
            bgcolor: 'background.paper',
            borderRadius: 4,
            boxShadow: 3,
            textAlign: 'center'
          }}>
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Forgot Password?
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Enter your email and we'll send you a code to reset your password
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  }
                }}
              />

              <motion.div whileHover={{ scale: 1.02 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  sx={{
                    mt: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                  }}
                >
                  Send Reset Code
                </Button>
              </motion.div>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link 
                  href="/login" 
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: theme.palette.primary.main,
                    }
                  }}
                >
                  Back to Sign In
                </Link>
              </Box>
            </form>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}