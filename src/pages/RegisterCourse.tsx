import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    Button,
    Chip,
  } from '@mui/material';
  import { useTheme } from '@mui/material/styles';
  import Header from '../components/header';
  import Footer from '../components/footer';
  import { useNavigate } from 'react-router-dom';
  
  const allCourses = [
    {
      id: 1,
      title: 'Beginner English Course',
      description: 'Master the basics of English with interactive lessons and daily practice.',
      image: 'https://tinyurl.com/y3repvhz',
      duration: '6 Weeks',
      level: 'Beginner',
    },
    {
      id: 2,
      title: 'Business English',
      description: 'Professional communication skills for the workplace.',
      image: 'https://tinyurl.com/y3repvhz',
      duration: '8 Weeks',
      level: 'Intermediate',
    },
    {
      id: 3,
      title: 'English Conversation Mastery',
      description: 'Improve your speaking and listening skills with real-life scenarios.',
      image: 'https://tinyurl.com/y3repvhz',
      duration: '10 Weeks',
      level: 'Advanced',
    },
  ];
  
  const levelColors = {
    Beginner: 'info',
    Intermediate: 'secondary',
    Advanced: 'error',
  } as const;
  
  export default function RegisterCourse() {
    const theme = useTheme();
    const navigate = useNavigate();
  
    const handleRegister = (course: typeof allCourses[0]) => {
      const registered = JSON.parse(localStorage.getItem('registeredCourses') || '[]');
      const exists = registered.some((c: any) => c.id === course.id);
      if (!exists) {
        registered.push({ ...course, progress: 0 });
        localStorage.setItem('registeredCourses', JSON.stringify(registered));
      }
      navigate('/course-regis');
    };
  
    return (
      <>
        <Header />
        <Box
          sx={{
            minHeight: '100vh',
            px: { xs: 2, md: 6 },
            py: 6,
            paddingTop: '100px',
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Typography variant="h4" gutterBottom textAlign="center" fontWeight={600}>
            Đăng ký khóa học mới
          </Typography>
          <Grid container spacing={4}>
            {allCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Card sx={{ borderRadius: 4, boxShadow: 6 }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={course.image}
                    alt={course.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>{course.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {course.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Chip
                        label={course.level}
                        color={levelColors[course.level as keyof typeof levelColors]}
                        size="small"
                      />
                      <Typography variant="caption">{course.duration}</Typography>
                    </Box>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleRegister(course)}
                      style={{borderRadius: '15px'}}
                    >
                      Đăng ký
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Footer />
      </>
    );
  }
  