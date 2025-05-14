import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';

const features = [
  {
    icon: '🎤',
    title: 'Pronunciation Scoring',
    description: 'Get instant feedback on your pronunciation with our advanced AI technology',
  },
  {
    icon: '🤖',
    title: 'AI Conversation Partner',
    description: 'Practice speaking anytime with our intelligent chatbot',
  },
  {
    icon: '📊',
    title: 'Personalized Learning',
    description: 'Customized lessons based on your level and progress',
  },
  {
    icon: '📝',
    title: 'Grammar Exercises',
    description: 'Interactive exercises with instant correction and explanations',
  },
];

export default function Home() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Master English with AI
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
              Personalized learning experience powered by artificial intelligence
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: 2 }}
            >
              Get Started
            </Button>
          </motion.div>
        </Box>

        <Box sx={{ mt: 12 }}>
          <Typography variant="h4" align="center" sx={{ mb: 6, fontWeight: 600 }}>
            Key Features
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 4,
            }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 1,
        height: '100%',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 3,
        },
      }}
    >
      <Typography variant="h3" sx={{ mb: 2 }}>
        {icon}
      </Typography>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
}