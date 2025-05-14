import {
  Box,
  Button,
  Drawer,
  IconButton,
  Typography,
  useTheme,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Menu, Mic } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PronunciationPractice from '../components/PronunciationPractice';
import ChatbotPanel from '../components/ChatbotPanel';
import GrammarExercise from '../components/GrammarExercise';
import FinalTest from '../components/FinalTest';
import Header from '../components/header';
import Footer from '../components/footer';

const lessons = [
  { id: 'pronunciation', title: 'Pronunciation Practice', component: <PronunciationPractice /> },
  { id: 'conversation', title: 'Daily Conversation', component: <ChatbotPanel /> },
  { id: 'grammar', title: 'Grammar Practice', component: <GrammarExercise /> },
  { id: 'finalTest', title: 'Final Test', component: <FinalTest /> }
];

export default function Learning() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(lessons[0].id);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNextLesson = () => {
    const currentIndex = lessons.findIndex(lesson => lesson.id === activeTab);
    const nextLesson = lessons[currentIndex + 1];
    if (nextLesson) {
      setActiveTab(nextLesson.id);
    } else if (activeTab === 'finalTest') {
      setShowCompletionModal(true);
    }    
  };

  const currentIndex = lessons.findIndex(lesson => lesson.id === activeTab);
  const progress = ((currentIndex + 1) / lessons.length) * 100;
  const activeComponent = lessons[currentIndex]?.component;

  useEffect(() => {
    const title = lessons[currentIndex]?.title || 'Lesson';
    document.title = `${title} | English Learning`;
  }, [activeTab]);

  const drawerContent = (
    <Box sx={{ width: 250, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Course Content
      </Typography>
      {lessons.map((lesson) => (
        <Button
          key={lesson.id}
          fullWidth
          sx={{
            justifyContent: 'flex-start',
            mb: 1,
            bgcolor: activeTab === lesson.id ? theme.palette.action.selected : 'transparent',
          }}
          onClick={() => setActiveTab(lesson.id)}
        >
          {lesson.title}
        </Button>
      ))}
    </Box>
  );

  return (
    <>
      <Header />
      <Box sx={{ display: 'flex', minHeight: '100vh', paddingTop: '100px' }}>
        {/* Sidebar for desktop */}
        <Box
          component="nav"
          sx={{ width: { md: 250 }, flexShrink: { md: 0 }, display: { xs: 'none', md: 'block' } }}
        >
          {drawerContent}
        </Box>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Main Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header Bar */}
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {lessons[currentIndex]?.title || 'Lesson'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" startIcon={<Mic />}>
                Practice
              </Button>
              <Button variant="contained" onClick={handleNextLesson}>
                Next Lesson
              </Button>
            </Box>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ px: 3, pt: 2 }}>
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                Progress: {Math.round(progress)}%
              </Typography>
            </Box>
          </Box>

          {/* Lesson Content */}
          <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
            {activeComponent}
          </Box>
        </Box>
      </Box>

      {/* Completion Modal */}
      <Dialog open={showCompletionModal} onClose={() => setShowCompletionModal(false)}>
        <DialogTitle>🎉 Chúc mừng!</DialogTitle>
        <DialogContent>
          <Typography>Bạn đã hoàn thành toàn bộ bài học của khóa học này.</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowCompletionModal(false);
              navigate('/course');
            }}
            variant="contained"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </>
  );
}
