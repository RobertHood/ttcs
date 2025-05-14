import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Grid,
    Typography,
    useTheme,
    LinearProgress,
    Chip,
  } from '@mui/material';
  import { useNavigate } from 'react-router-dom';
  import Header from '../components/header';
  import Footer from '../components/footer';
  
  const levelColors = {
    Beginner: 'info',        
    Intermediate: 'secondary', 
    Advanced: 'error',
  } as const;
  
  const courses = [
    {
      id: 1,
      title: 'Beginner English Course',
      description: 'Master the basics of English with interactive lessons and daily practice.',
      image: 'https://tinyurl.com/y3repvhz',
      progress: 30,
      duration: '6 Weeks',
      level: 'Beginner',
    },
    {
      id: 2,
      title: 'Business English',
      description: 'Professional communication skills for the workplace.',
      image: 'https://tinyurl.com/y3repvhz',
      progress: 0,
      duration: '8 Weeks',
      level: 'Intermediate',
    },
    {
      id: 3,
      title: 'English Conversation Mastery',
      description: 'Improve your speaking and listening skills with real-life scenarios.',
      image: 'https://tinyurl.com/y3repvhz',
      progress: 65,
      duration: '10 Weeks',
      level: 'Advanced',
    },
  ];
  
  export default function Course() {
    const theme = useTheme();
    const navigate = useNavigate();
  
    const handleCourseClick = (id: number) => {
      navigate(`/learn`);
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
            Các khóa học của bạn
          </Typography>
          <Grid container spacing={4}>
            {courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    boxShadow: 6,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: 10,
                    },
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardActionArea onClick={() => handleCourseClick(course.id)} sx={{ flex: 1 }}>
                    <Box sx={{ position: 'relative', height: 180 }}>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundImage: `url(${course.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          filter: 'brightness(0.8)',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '60%',
                          background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 12,
                          left: 16,
                          color: 'white',
                        }}
                      >
                        <Typography variant="h6">{course.title}</Typography>
                      </Box>
                    </Box>
  
                    <CardContent sx={{ px: 3, py: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {course.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Chip
                          label={course.level}
                          color={levelColors[course.level as keyof typeof levelColors]}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {course.duration}
                        </Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={course.progress} />
                      <Typography variant="caption" color="text.secondary">
                        Progress: {course.progress}%
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Footer />
      </>
    );
  }
  