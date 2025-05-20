import { useEffect, useRef } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { Edit, Language, Star, TrendingUp } from '@mui/icons-material';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from 'recharts';
import Header from '../components/header';
import Footer from '../components/footer';
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css';


const courseSuggestions = [
  'Ngữ pháp cơ bản',
  'Giao tiếp hàng ngày',
  'Tiếng Anh thương mại',
  'Viết học thuật',
];
export default function Profile() {
  const theme = useTheme();
  const [editOpen, setEditOpen] = useState(false);
  const defaultUserData = {
    profileName: '',
    email: '',
    level: 'Beginner',
    language: 'English',
    avatarUrl: '',
    userXP: 0,
    strengths: {
      pronunciation: 0,
      grammar: 0,
      vocabulary: 0,
      fluency: 0
    },
    progress: []
  };
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [CourseInProgress, setCourseInProgress] = useState([]);
  const [userData, setUserData] = useState(defaultUserData);
  const level = Math.floor(userData.userXP / 100) + 1;
  const xpForCurrentLevel = (level - 1) * 100;
  const xpForNextLevel = level * 100;
  const progressPercent = ((userData.userXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/auth/profile', {
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok && data.data) {
        setUserData({ ...defaultUserData, ...data.data, strengths: { ...defaultUserData.strengths, ...(data.data.strengths || {}) }, progress: data.data.progress || [] });
        setEnrolledCourses(data.data.courseEnrolled || []);
        setCourseInProgress(data.data.CourseInProgress || []);
      } else {
        setUserData(defaultUserData);
        setEnrolledCourses([]);
        setCourseInProgress([]);
      }
    } catch (error) {
      setUserData(defaultUserData);
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdateProfile = async (updatedData: any) => {
    try {
      const response = await fetch('http://localhost:8001/api/auth/profile/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data.data);
        setEditOpen(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Update strengthData and progressData to use real data
  const strengthData = [
    { skill: 'Phát âm', value: userData.strengths.pronunciation },
    { skill: 'Ngữ pháp', value: userData.strengths.grammar },
    { skill: 'Từ vựng', value: userData.strengths.vocabulary },
    { skill: 'Trôi chảy', value: userData.strengths.fluency },
  ];

  const progressData = userData.progress;

  return (
    <>
    <Header />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="lg">
          {/* Thông tin cá nhân */}
          <Card sx={{ p: 4, mb: 4, borderRadius: 4 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 150,
                    height: 150,
                    mx: 'auto',
                    mb: 2,
                    border: `4px solid ${theme.palette.primary.main}`,
                  }}
                  src={userData.avatarUrl}
                />
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setEditOpen(true)}
                  sx={{ borderRadius: 20 }}
                >
                  Chỉnh sửa
                </Button>
              </Grid>

              <Grid item xs={12} md={9}>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {userData.profileName}
                  <Chip
                    label={`Level: ${level}`}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ ml: 2 }}
                  />
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Chip icon={<Star />} label={`${userData.userXP} XP`} variant="filled" color="warning" />
                  <Chip icon={<Language />} label={`Ngôn ngữ: ${userData.language}`} variant="filled" />
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={progressPercent}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    bgcolor: 'divider',
                    '& .MuiLinearProgress-bar': { borderRadius: 6 },
                  }}
                />
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  {xpForNextLevel - xpForCurrentLevel} XP till next level!
                </Typography>
              </Grid>
            </Grid>
          </Card>

          {/* Biểu đồ chiếm toàn bộ màn hình */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Biểu đồ tiến trình học tập
              </Typography>
              <Card sx={{ p: 2 }}>
                <ResponsiveContainer width="1120px" height="100%">
                  <CalendarHeatmap
                  startDate={new Date('2016-01-01')}
                  endDate={new Date('2016-12-31')}
                  values={[
                    { date: '2016-01-01', count: 12 },
                    { date: '2016-01-22', count: 122 },
                    { date: '2016-01-30', count: 38 },
                    
                  ]}
                />
                </ResponsiveContainer>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Phân tích kỹ năng bởi AI
              </Typography>
              <Card sx={{ p: 2 }}>
                <ResponsiveContainer width="100%" height={300} minWidth={500}>
                  <RadarChart data={strengthData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <Radar
                      dataKey="value"
                      stroke={theme.palette.primary.main}
                      fill={theme.palette.primary.main}
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          </Grid>

          {/* Đề xuất khóa học */}
          <Box sx={{ mt: 5 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Các khóa học đã hoàn thành
            </Typography>
            <Grid container spacing={2}>
                  {enrolledCourses.length === 0 ? (
                    <Grid item xs={12}>
                      <Typography variant="body1">Bạn chưa hoàn thành khóa học nào.</Typography>
                    </Grid>
                  ) : (
                    enrolledCourses.map((course: any) => (
                      <Grid item xs={12} key={course._id}>
                        <Card sx={{ p: 2, position: 'relative', overflow: 'hidden', width: '100%'}}>
                          <Typography variant="body1" fontWeight={600}>{course.title}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {course.description}
                          </Typography>
                          <Chip
                            label={course.category?.name || ''}
                            color="secondary"
                            size="small"
                            sx={{ position: 'absolute', top: 8, right: 8 }}
                          />
                        </Card>
                      </Grid>
                    ))
                  )}
                </Grid>
              </Box>

              <Box sx={{ mt: 5 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Các khóa học đang tham gia
            </Typography>
            <Grid container spacing={2}>
                  {CourseInProgress.length === 0 ? (
                    <Grid item xs={12}>
                      <Typography variant="body1">Bạn chưa tham gia khóa học nào.</Typography>
                    </Grid>
                  ) : (
                    CourseInProgress.map((course: any) => (
                      <Grid item xs={12} key={course._id}>
                        <Card sx={{ p: 2, position: 'relative', overflow: 'hidden', width: '100%'}}>
                          <Typography variant="body1" fontWeight={600}>{course.title}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {course.description}
                          </Typography>
                          <Chip
                            label={course.category?.name || ''}
                            color="secondary"
                            size="small"
                            sx={{ position: 'absolute', top: 8, right: 8 }}
                          />
                        </Card>
                      </Grid>
                    ))
                  )}
                </Grid>
              </Box>
        </Container>

        {/* Popup chỉnh sửa hồ sơ */}
        <EditProfileDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          initialData={userData}
          onSave={(data) => handleUpdateProfile(data)}
        />
      </Box>
    <Footer />
    </>
  );
}

// Update EditProfileDialog props and types
interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
  initialData: any;
  onSave: (data: any) => void;
}

function EditProfileDialog({ open, onClose, initialData, onSave }: EditProfileDialogProps) {
  const [form, setForm] = useState({ ...initialData });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm({ ...initialData });
  }, [initialData, open]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
    setForm({ ...form, [field]: event.target.value });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await fetch('http://localhost:8001/api/auth/profile/avatar', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setForm((prev: any) => ({ ...prev, avatarUrl: data.url }));
      }
    } catch (err) {
      // handle error
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    onSave({
      profileName: form.profileName || '',
      level: form.level || 'Beginner',
      language: form.language || 'English',
      avatarUrl: form.avatarUrl || '',
      strengths: form.strengths || { pronunciation: 0, grammar: 0, vocabulary: 0, fluency: 0 },
      progress: form.progress || []
    });
    onClose();
    window.location.reload();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Avatar src={form.avatarUrl} sx={{ width: 100, height: 100, mx: 'auto' }} />
          <Button variant="outlined" component="label" sx={{ mt: 1 }} disabled={uploading}>
            {uploading ? 'Đang tải...' : 'Tải ảnh'}
            <input type="file" hidden accept="image/*" onChange={handleAvatarChange} ref={fileInputRef} />
          </Button>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tên người dùng"
              value={form.profileName}
              onChange={handleChange('profileName')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Ngôn ngữ học"
              value={form.language}
              onChange={handleChange('language')}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSave}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
