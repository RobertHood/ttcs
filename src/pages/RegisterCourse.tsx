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
import { useEffect, useState } from 'react';

export default function RegisterCourse() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [allCourses, setAllCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/english/all-courses", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await response.json();
        if (response.ok && data.data) {
          setAllCourses(data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCourses();
  }, []);

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
          Các khóa học
        </Typography>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Grid 
              container 
              spacing={4} 
              sx={{ maxWidth: '1900px', justifyContent: 'flex-start' }}
            >
              {allCourses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                  <Card sx={{ borderRadius: 4, boxShadow: 6, height: '100%', display: 'flex', flexDirection: 'column', minWidth: 505}}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={`http://localhost:8001/${course.headerImage}`}
                      alt={course.title}
                      crossOrigin="anonymous"
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>{course.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {course.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Chip
                          label={course.category?.name || ''}
                          color="secondary"
                          size="small"
                        />
                        <Typography variant="caption">{course.duration} hours</Typography>
                      </Box>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => navigate(`/course/${course._id}`)}
                        style={{ borderRadius: '15px' }}
                      >
                        Chi tiết khóa học
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
      </Box>
      <Footer />
    </>
  );
}
