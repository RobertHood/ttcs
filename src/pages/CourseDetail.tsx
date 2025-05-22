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
import { JSX, useEffect, useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { Accordion, AccordionSummary, AccordionDetails, AccordionActions} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const navigate = useNavigate();
  const [courseInProgress, setCourseInProgress] = useState<any[]>([]);


  function renderRichText(text: string): JSX.Element[] {
  const pattern = /(\*\*.*?\*\*|\*[^*]+\*|_[^_]+_|__[^_]+__|`[^`]+`)/g;
  const parts = text.split(pattern);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <b key={idx}>{part.slice(2, -2)}</b>;
    } else if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
      return <i key={idx}>{part.slice(1, -1)}</i>;
    } else if (part.startsWith('__') && part.endsWith('__')) {
      return <u key={idx}>{part.slice(2, -2)}</u>;
    } else if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={idx}
          style={{
            background: '#f5f5f5',
            borderRadius: '4px',
            padding: '2px 4px',
            fontFamily: 'monospace',
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
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
          console.log(data)
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
    const fetchCourseInProgress = async () =>{
      try{
        const response = await fetch('http://localhost:8001/api/auth/profile', {
          credentials: 'include'
        });
        const data = await response.json();
        if (response.ok && data.data){
          setCourseInProgress(data.data.CourseInProgress);
        }
      }catch (error) {
        console.log(error)
      }
    };
    fetchCourseInProgress();
  })


  if (!course) return <Typography>Loading...</Typography>;
  const isInProgress = courseInProgress.some((c: any) => c._id === course._id);
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
                {renderRichText(line)}
                <br/>
              </span>
            ))}</Typography>
            <Typography variant="body1" color="blue" gutterBottom>
              * {renderRichText("**Thời lượng:**")} {course.duration} giờ
            </Typography>
          </CardContent>
          </Card>

          {/*lộ trình khóa học*/}

          <Card sx={{ borderRadius: 4, boxShadow: 6,  display: 'flex', flexDirection: 'column', width: '800px'}}>
          <CardContent>
            
            <Typography variant="h3" fontWeight={600} gutterBottom paddingTop={1}>Lộ trình khóa học </Typography>
            <Typography><hr/></Typography>
           {course.roadmap && course.roadmap.length > 0 ? (
              course.roadmap.map((section: any, idx: number) => (
                <Accordion key={idx} defaultExpanded={idx === 0}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${idx}-content`}
                    id={`panel${idx}-header`}
                  >
                    <Box display={"flex"} flexDirection={'column'}><Typography component="span" fontWeight={600}>
                      {section.title}
                    </Typography>
                    <Typography variant='body2'>{section.description}</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {section.lessons && section.lessons.length > 0 ? (
                      section.lessons.map((lesson: any, lidx: number) => (
                        <Box
                          key={lidx}
                          sx={{
                            border: '1px dashed #d0d7de',
                            borderRadius: 2,
                            p: 2,
                            mb: 2,
                            bgcolor: '#fafbfc'
                          }}
                        >
                          <Typography variant="subtitle1" color="primary" fontWeight={600}>
                            <span style={{ color: '#0099ff', marginRight: 8 }}>▶</span>
                            {lesson.title}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">Chưa có bài học</Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">Chưa có lộ trình</Typography>
            )}
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
            {isInProgress ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3 }}>
              <Chip label="Registered" color="success" />
              <Button
                variant="contained"
                color="warning"
                sx={{ borderRadius: '15px' }}
                onClick={() => navigate(`/learning/${course._id}`)}
              >
                Tiếp tục học
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              onClick={() => navigate(`/learning/${course._id}`)}
              sx={{ mt: 3, borderRadius: '15px' }}
            >
              Đăng ký học
            </Button>
          )}
          </CardContent>
        </Card>
      </Grid>
      <Footer />
    </>
  );
}
