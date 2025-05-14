import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    MenuItem,
    Button,
    Grid,
    InputAdornment,
  } from '@mui/material';
  import { useState } from 'react';
  import Header from '../components/header';
  import Footer from '../components/footer';
  import { useNavigate } from 'react-router-dom';
  import PersonIcon from '@mui/icons-material/Person';
  import EmailIcon from '@mui/icons-material/Email';
  import BookIcon from '@mui/icons-material/Book';
  
  const allCourses = [
    { id: 1, title: 'Beginner English Course' },
    { id: 2, title: 'Business English' },
    { id: 3, title: 'English Conversation Mastery' },
  ];
  
  export default function CourseRegistrationForm() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({ email: false });
  
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      selectedCourseId: '',
    });
  
    const validateEmail = (email: string) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      
      if (name === 'email') {
        setErrors({ ...errors, email: !validateEmail(value) });
      }
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (errors.email) return;
  
      const selectedCourse = allCourses.find(c => c.id === Number(formData.selectedCourseId));
      if (!selectedCourse) return;
  
      const registered = JSON.parse(localStorage.getItem('registeredCourses') || '[]');
      const exists = registered.some((c: any) => c.id === selectedCourse.id);
      if (!exists) {
        registered.push({ ...selectedCourse, progress: 0 });
        localStorage.setItem('registeredCourses', JSON.stringify(registered));
      }
  
      navigate('/course');
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
            background: 'linear-gradient(150deg, #f8f9ff 0%, #e7f3ff 100%)',
          }}
        >
          <Typography 
            variant="h3" 
            gutterBottom 
            textAlign="center" 
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              mb: 6,
              textTransform: 'uppercase',
              letterSpacing: 2,
              fontFamily: "'Roboto Condensed', sans-serif",
            }}
          >
            Đăng Ký Khóa Học
          </Typography>
  
          <Grid container justifyContent="center">
            <Grid item xs={12} md={8} lg={6}>
              <Card 
                sx={{ 
                  p: 3,
                  borderRadius: 4,
                  boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  },
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      label="Họ và tên"
                      name="name"
                      required
                      margin="normal"
                      value={formData.name}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '& fieldset': { borderWidth: 2 },
                        }
                      }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      required
                      margin="normal"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      helperText={errors.email ? 'Vui lòng nhập địa chỉ email hợp lệ' : ''}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '& fieldset': { borderWidth: 2 },
                        }
                      }}
                    />
                    
                    <TextField
                      select
                      fullWidth
                      label="Chọn khóa học"
                      name="selectedCourseId"
                      required
                      margin="normal"
                      value={formData.selectedCourseId}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BookIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 4,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '& fieldset': { borderWidth: 2 },
                        }
                      }}
                    >
                      {allCourses.map(course => (
                        <MenuItem 
                          key={course.id} 
                          value={course.id}
                          sx={{ py: 1.5 }}
                        >
                          <Typography fontWeight={500}>
                            {course.title}
                          </Typography>
                        </MenuItem>
                      ))}
                    </TextField>
                    
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      sx={{ 
                        mt: 2,
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: 18,
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #1976d2 0%, #2196f3 100%)',
                        boxShadow: '0 4px 6px rgba(25, 118, 210, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 8px rgba(25, 118, 210, 0.3)',
                          background: 'linear-gradient(45deg, #1565c0 0%, #1e88e5 100%)',
                        }
                      }}
                    >
                      Đăng Ký 
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        <Footer />
      </>
    );
  }