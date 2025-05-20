import {
  Box,
  Grid,
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

  function renderWithBold(text: string) {
  
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <b key={idx}>{part.slice(2, -2)}</b>;
    }
    return <span key={idx}>{part}</span>;
  });
}

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
      <Grid container spacing={4} sx={{ px: 4, py: 10 }} justifyContent={"center"}>
        <Box display={"grid"} gridTemplateRows={" repeat(auto-fit, 1fr)"} gap={3}>
          <Card sx={{ borderRadius: 4, boxShadow: 6, display: 'flex', flexDirection: 'column', width: '800px'}}>
          <CardContent>
            <Typography variant="h3" fontWeight={600} gutterBottom paddingTop={1} >Tổng quan khóa học </Typography>
            <Typography><hr/></Typography>
            
            <Typography variant="body1" sx={{whiteSpace: 'pre-line', mb: 2 }}>{course.content.split(/\\n|\/n|\n/).map((line: string, idx: number) => (
              <span key={idx}>
                {renderWithBold(line)}
                <br/>
              </span>
            ))}</Typography>
            <Typography variant="body1" color="blue" gutterBottom>
              * {renderWithBold("**Thời lượng:**")} {course.duration} giờ
            </Typography>
            <Typography variant="body1" color="blue" gutterBottom>
              * {renderWithBold("**Giảng viên:**")} {course.instructor}
            </Typography>
          </CardContent>
          </Card>

          {/*lộ trình khóa học*/}

          <Card sx={{ borderRadius: 4, boxShadow: 6,  display: 'flex', flexDirection: 'column', width: '800px'}}>
          <CardContent>
            <Typography variant="h3" fontWeight={600} gutterBottom paddingTop={1} >Lộ trình khóa học </Typography>
            <Typography><hr/></Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{course.description}</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Thời lượng: {course.duration} giờ
            </Typography>
            <Typography variant="body2"> {course.content} </Typography>
          </CardContent>
          </Card>
          <Card sx={{ borderRadius: 4, boxShadow: 6, display: 'flex', flexDirection: 'column', width: '800px'}}>
          <CardContent>
            <Typography variant="h3" fontWeight={600} gutterBottom paddingTop={1} >Tổng quan khóa học </Typography>
            <Typography><hr/></Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{course.description}</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Thời lượng: {course.duration} giờ
            </Typography>
            <Typography variant="body2"> {course.content} </Typography>
          </CardContent>
          </Card>
        </Box>
        <Card sx={{ borderRadius: 4, boxShadow: 6, display: 'flex', flexDirection: 'column', width: '500px', height: "100%"}}>
          <CardMedia
            component="img"
            height="300"
            image={`http://localhost:8001/${course.headerImage}`}
            alt={course.title}
            crossOrigin='anonymous'
          />
          <CardContent>
            <Typography variant="h4" fontWeight={600} gutterBottom>{course.title}</Typography>
            <Chip label={course.category.name} color="primary" sx={{ mb: 2 }} />
            <Typography variant="body1" sx={{ mb: 2 }}>{course.description}</Typography>
            <Button variant="contained" onClick={handleRegister} sx={{ mt: 3, borderRadius: '15px' }}>
              Đăng ký học
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Footer />
    </>
  );
}
