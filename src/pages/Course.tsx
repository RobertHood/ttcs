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
    CardMedia,
  } from '@mui/material';
  import { useNavigate } from 'react-router-dom';
  import Header from '../components/header';
  import Footer from '../components/footer';
  import {useEffect, useState} from 'react';
  
export default function Course() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [inProgressCourses, setInProgressCourses] = useState<any[]>([]);

  useEffect(() => {
    // Fetch user data with populated course arrays
    fetch('http://localhost:8001/api/user/me', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setEnrolledCourses(data.user.courseEnrolled || []);
        setInProgressCourses(data.user.CourseInProgress || []);
      });
  }, []);

  const handleCourseClick = (id: string) => {
    navigate(`/course/${id}`);
  };

  // Merge and deduplicate courses (if a course is in both arrays)
  const allCoursesMap = new Map();
  [...enrolledCourses, ...inProgressCourses].forEach(course => {
    allCoursesMap.set(course._id, course);
  });
  const allCourses = Array.from(allCoursesMap.values());

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
          {allCourses.map((course) => {
            
            const isCompleted = enrolledCourses.some((enrolled) => enrolled._id === course._id);
            return (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card
                  sx={{
                    height: '100%',
                    width: '505px',
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
                  <CardActionArea onClick={() => handleCourseClick(course._id)} sx={{ flex: 1 }}>
                    <Box sx={{ position: 'relative', height: 200 }}>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          filter: 'brightness(0.8)',
                        }}
                      />
                      <CardMedia
                      component="img"
                      height="200"
                      image={`http://localhost:8001/${course.headerImage}`}
                      alt={course.title}
                      crossOrigin="anonymous">
                      </CardMedia>
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
                        label={isCompleted ? 'Completed' : 'In Progress'}
                        color={isCompleted ? 'success' : 'warning'}
                        size="small"
                        sx={{ mt: 1, fontWeight: 500 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {course.duration} hours
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
      <Footer />
    </>
  );
}
