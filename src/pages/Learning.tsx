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
import { useNavigate, useParams } from 'react-router-dom';

import PronunciationPractice from '../components/PronunciationPractice';
import ChatbotPanel from '../components/ChatbotPanel';
import GrammarExercise from '../components/GrammarExercise';
import FinalTest from '../components/FinalTest';
import Header from '../components/header';
import Footer from '../components/footer';

const lessonComponentMap: Record<string, React.ComponentType<any>> = {
  pronunciation: PronunciationPractice,
  grammar: GrammarExercise,
  chatbot: ChatbotPanel,
  final: FinalTest,
};

export default function Learning() {
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  async function addXPToUser(amount = 10) {
  await fetch('http://localhost:8001/api/user/add-xp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ xp: amount }),
  });
}

 useEffect(() => {
  fetch(`http://localhost:8001/api/english/course/${id}`)
    .then(res => res.json())
    .then(data => {
      const roadmapData = data.data.roadmap || [];
      setRoadmap(roadmapData);
      const allLessons = roadmapData.flatMap((section: any) => section.lessons || []);
      const uniqueLessons = Array.from(new Map(allLessons.map((l: any) => [l._id, l])).values());
      setLessons(uniqueLessons);
      if (uniqueLessons.length > 0) setActiveTab(uniqueLessons[0]._id);
    });
}, [id]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNextLesson = async () => {
  await addXPToUser(10);
  const currentIndex = lessons.findIndex(lesson => lesson._id === activeTab);
  const nextLesson = lessons[currentIndex + 1];
  if (nextLesson) {
    setActiveTab(nextLesson._id);
  } else {
    setShowCompletionModal(true);
  }
};

  const currentIndex = lessons.findIndex(lesson => lesson._id === activeTab);
  const progress = lessons.length > 0 ? ((currentIndex + 1) / lessons.length) * 100 : 0;;
  const lessonType = lessons[currentIndex]?.category;
  const LessonComponent = lessonComponentMap[lessonType];

  const activeComponent = LessonComponent ? <LessonComponent lesson={lessons[currentIndex]} /> : null;
  console.log(lessons)
  useEffect(() => {
    const title = lessons[currentIndex]?.title || 'Lesson';
    document.title = `${title} | English Learning`;
  }, [activeTab]);

  const drawerContent = (
  <Box sx={{ width: 250, p: 2 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Course Content
    </Typography>
    {roadmap.map((section: any, sidx: number) => (
      <Box key={sidx} sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
          {section.title}
        </Typography>
        {(section.lessons || []).map((lesson: any) => (
          <Button
            key={lesson._id}
            fullWidth
            sx={{
              justifyContent: 'flex-start',
              mb: 1,
              bgcolor: activeTab === lesson._id ? theme.palette.action.selected : 'transparent',
            }}
            onClick={() => setActiveTab(lesson._id)}
          >
            {lesson.title}
          </Button>
        ))}
      </Box>
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
