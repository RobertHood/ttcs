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

const strengthData = [
  { skill: 'Phát âm', value: 85 },
  { skill: 'Ngữ pháp', value: 70 },
  { skill: 'Từ vựng', value: 90 },
  { skill: 'Trôi chảy', value: 65 },
];

const progressData = [
  { month: 'Tháng 1', progress: 45 },
  { month: 'Tháng 2', progress: 65 },
  { month: 'Tháng 3', progress: 80 },
  { month: 'Tháng 4', progress: 92 },
];

const courseSuggestions = [
  'Ngữ pháp cơ bản',
  'Giao tiếp hàng ngày',
  'Tiếng Anh thương mại',
  'Viết học thuật',
];

export default function Profile() {
  const theme = useTheme();

  const [editOpen, setEditOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    level: 'Advanced',
    language: 'English',
    avatar: '/path-to-avatar.jpg',
  });

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
                  src={userData.avatar}
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
                  {userData.name}
                  <Chip
                    label={`Trình độ: ${userData.level}`}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ ml: 2 }}
                  />
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Chip icon={<Star />} label="568 XP" variant="filled" color="warning" />
                  <Chip icon={<TrendingUp />} label="Top 15%" variant="filled" color="success" />
                  <Chip icon={<Language />} label={`Ngôn ngữ: ${userData.language}`} variant="filled" />
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={75}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    bgcolor: 'divider',
                    '& .MuiLinearProgress-bar': { borderRadius: 6 },
                  }}
                />
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  Đã hoàn thành 75% mục tiêu tháng
                </Typography>
              </Grid>
            </Grid>
          </Card>

          {/* Biểu đồ chiếm toàn bộ màn hình */}
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Biểu đồ tiến trình học tập
              </Typography>
              <Card sx={{ p: 2 }}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="progress"
                      stroke={theme.palette.secondary.main}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Phân tích kỹ năng bởi AI
              </Typography>
              <Card sx={{ p: 2 }}>
                <ResponsiveContainer width="100%" height={300}>
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
              Lộ trình học đề xuất
            </Typography>
            <Grid container spacing={2}>
              {courseSuggestions.map((course, index) => (
                <Grid item xs={12} sm={6} md={3} key={course}>
                  <Card
                    sx={{
                      p: 2,
                      bgcolor: index === 1 ? 'primary.light' : 'background.paper',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:after': index === 1
                        ? {
                            content: '""',
                            position: 'absolute',
                            right: -20,
                            top: -20,
                            width: 40,
                            height: 40,
                            bgcolor: 'primary.main',
                            borderRadius: '50%',
                          }
                        : {},
                    }}
                  >
                    <Typography variant="body1">{course}</Typography>
                    {index === 1 && (
                      <Chip
                        label="Đang học"
                        color="primary"
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                      />
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>

        {/* Popup chỉnh sửa hồ sơ */}
        <EditProfileDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          initialData={userData}
          onSave={(data) => setUserData(data)}
        />
      </Box>
    <Footer />
    </>
  );
}

// Popup chỉnh sửa
function EditProfileDialog({ open, onClose, initialData, onSave }) {
  const [form, setForm] = useState(initialData);

  const handleChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Avatar src={form.avatar} sx={{ width: 100, height: 100, mx: 'auto' }} />
          <Button variant="outlined" component="label" sx={{ mt: 1 }}>
            Tải ảnh
            <input type="file" hidden />
          </Button>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tên người dùng"
              value={form.name}
              onChange={handleChange('name')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Trình độ"
              value={form.level}
              onChange={handleChange('level')}
            >
              <MenuItem value="Beginner">Mới bắt đầu</MenuItem>
              <MenuItem value="Intermediate">Trung cấp</MenuItem>
              <MenuItem value="Advanced">Nâng cao</MenuItem>
            </TextField>
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
