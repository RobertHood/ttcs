import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:8001/api/english/course/${id}`);
        const data = await response.json();
        if (response.ok && data.data) {
          setCourse(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourse();
  }, [id]);

  const handleRegister = () => {
    const registered = JSON.parse(localStorage.getItem('registeredCourses') || '[]');
    const exists = registered.some((c: any) => c.id === course.id);
    if (!exists) {
      registered.push({ ...course, progress: 0 });
      localStorage.setItem('registeredCourses', JSON.stringify(registered));
    }
    navigate('/course-regis');
  };

  if (!course) return <Typography>Loading...</Typography>;

  return (
    <>
      <Header />
      <Box sx={{ px: 4, py: 10 }}>
        <Card sx={{ maxWidth: 800, margin: '0 auto', borderRadius: 4, boxShadow: 6 }}>
          <CardMedia
            component="img"
            height="300"
            image={`http://localhost:8001/${course.headerImage}`}
            alt={course.title}
            crossOrigin='anonymous'
          />
          <CardContent>
            <Typography variant="h4" fontWeight={600} gutterBottom>{course.title}</Typography>
            <Chip label={course.category} color="primary" sx={{ mb: 2 }} />
            <Typography variant="body1" sx={{ mb: 2 }}>{course.description}</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Thời lượng: {course.duration} giờ
            </Typography>
            <Button variant="contained" onClick={handleRegister} sx={{ mt: 3, borderRadius: '15px' }}>
              Đăng ký học
            </Button>
          </CardContent>
        </Card>
      </Box>
      <Footer />
    </>
  );
}
