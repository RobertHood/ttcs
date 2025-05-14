import { Box, Container, Typography, IconButton, Stack, useTheme } from '@mui/material';
import { Facebook, YouTube, Instagram, Email } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: 'background.paper', color: 'text.primary', py: 8, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
            
            <Box>
                <Typography
                variant="h5" 
                sx={{
                    fontWeight: 700,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
                    cursor: 'pointer',
                }}
                onClick={() => navigate('/')}
                >
                AI English Tutor
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800 }}>
                Nền tảng học tiếng Anh thông minh giúp bạn cải thiện kỹ năng ngôn ngữ nhanh chóng thông qua trí tuệ nhân tạo.
                </Typography>
            </Box>

            <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Liên hệ
                </Typography>
                <Typography variant="body1" color="text.secondary">
                📧 aienglish@gmail.com<br />
                📍 123 Đường ABC, Quận A, TP. Hà Nội
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <IconButton color="inherit" size="large"><Facebook fontSize="large" /></IconButton>
                <IconButton color="inherit" size="large"><YouTube fontSize="large" /></IconButton>
                <IconButton color="inherit" size="large"><Instagram fontSize="large" /></IconButton>
                <IconButton color="inherit" size="large"><Email fontSize="large" /></IconButton>
                </Stack>
            </Box>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                © {new Date().getFullYear()} AI English. All rights reserved.
            </Typography>
            </Box>
        </Container>
    </Box>
  );
}
