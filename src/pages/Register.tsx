import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  useTheme,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { motion } from 'framer-motion';

export default function Signup() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    navigate('/dashboard');
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
            {/* Tiêu đề gradient đồng bộ */}
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
              Start Learning Today!
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                sx={textFieldStyle}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                sx={textFieldStyle}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                sx={textFieldStyle}
              />

              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{' '}
                    <Link href="/terms" sx={{ color: 'primary.main' }}>Terms of Service</Link>
                  </Typography>
                }
                sx={{ mt: 2, justifyContent: 'center' }}
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
                  Create Account
                </Button>
              </motion.div>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 500,
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Log in
                  </Link>
                </Typography>
              </Box>
            </form>
          </Box>

          {/* Social Signup Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Typography variant="body2" sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
              Or sign up with
            </Typography>
            <Box sx={{ 
              mt: 2, 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 2,
              '& button': {
                width: 100,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }
            }}>
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

const textFieldStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '&.Mui-focused fieldset': {
      borderColor: (theme: { palette: { primary: { main: any; }; }; }) => theme.palette.primary.main,
    },
  },
  '& label.Mui-focused': {
    color: (theme: { palette: { primary: { main: any; }; }; }) => theme.palette.primary.main,
  }
};