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

export default function ResetPassword() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (password !== confirmPassword) {
    setSnackbar({ open: true, message: 'Passwords do not match', severity: 'error' });
    return;
  }
  try {
    console.log(email, code, password);
    const response = await fetch(`http://localhost:8001/api/auth/verify-forgot-password-code`, {
      method: 'PATCH',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, password })
    });
    const data = await response.json();
    console.log(data);
    if (response.ok || data.success) {
      setSnackbar({ open: true, message: 'Password reset successful! Redirecting...', severity: 'success' });
      setTimeout(() => navigate('/login'), 3000);
    
    } else {
      setSnackbar({ open: true, message: data.message || 'Reset failed', severity: 'error' });
    }
  } catch (error) {
    console.log(error);
    setSnackbar({ open: true, message: 'An error occurred', severity: 'error' });
  }
};

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
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
              Reset your Password!
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                required
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
              <TextField
                required
                fullWidth
                label="Password"
                variant="outlined"
                margin="normal"
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  }
                }}
              />
              <TextField
                required
                fullWidth
                label="Confirm Password"
                type='password'
                variant="outlined"
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  }
                }}
              />
              <TextField
                required
                fullWidth
                label="Code (sent to you via email)"
                variant="outlined"
                margin="normal"
                value={code}
                onChange={(e) => setCode(e.target.value)}
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
                  Submit
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