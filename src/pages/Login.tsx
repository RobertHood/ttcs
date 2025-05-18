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

export default function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      
      const response = await fetch('http://localhost:8001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setError('Login successful! Redirecting');
        navigate("/registercourse");
      }else{
        setError(data.message || "Login failed");
        return;
      }
   } catch (error) {
      console.error('Error:', error);
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
            {/* Tiêu đề với gradient giống Home */}
            <Typography
              variant="h4"
              sx={{
                mb: 3,
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Welcome Back!
            </Typography>
            <Typography
              variant="body2"
              id="error-message"
              color={error ? 'primary' : 'error'}
              display={error ? 'block' : 'none'}
              sx={{minHeight: 24, mb: 1}}
            >
              {error}
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                id="email"
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
                fullWidth
                label="Password"
                id="password"
                type="password"
                variant="outlined"
                margin="normal"
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
                  Sign In
                </Button>
              </motion.div>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Link 
                  href="/forgot-password" 
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: theme.palette.primary.main,
                    }
                  }}
                >
                  Forgot password?
                </Link>
                <Link 
                  href="/register" 
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: theme.palette.primary.main,
                    }
                  }}
                >
                  Create new account
                </Link>
              </Box>
            </form>
          </Box>

          {/* Social Login Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Typography variant="body2" sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
              Or continue with
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
              {['Google', 'Facebook', 'Apple'].map((provider) => (
                <motion.div key={provider} whileHover={{ scale: 1.1 }}>
                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      color: 'text.primary',
                      borderColor: theme.palette.divider,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                      }
                    }}
                  >
                    {provider}
                  </Button>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}