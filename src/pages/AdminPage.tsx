import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Theme,
  Toolbar,
  Typography,
  CircularProgress,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Menu,
  ChevronLeft,
  Dashboard,
  People,
  LibraryBooks,
  Category as CategoryIcon,
  BarChart,
  Settings,
  Edit,
  Delete,
  Add,
  Upload,
  Person,
  MenuBook,
  Class,
} from '@mui/icons-material';
import { categoryService, type Category } from '../config/categoryService';
import { courseService, type Course } from '../config/courseService';
import { userService, type User } from '../config/userService';
import RoadmapEditor from '../components/RoadmapEditor';

const drawerWidth = 240;

export default function AdminPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [roadmap, setRoadmap] = useState([]);

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, view: 'dashboard' },
    { text: 'Người dùng', icon: <People />, view: 'users' },
    { text: 'Khóa học', icon: <LibraryBooks />, view: 'courses' },
    { text: 'Danh mục', icon: <CategoryIcon />, view: 'categories' },
    { text: 'Cài đặt', icon: <Settings />, view: 'settings' },
  ];

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'users':
        return <UsersView />;
      case 'courses':
        return <CoursesView />;
      case 'categories':
        return <CategoriesView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Trang quản trị
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
          }),
          ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
          }),
        }}
        open={open}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1] }}>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeft />
          </IconButton>
        </Toolbar>
        <Divider />
        
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.view} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => setActiveView(item.view)}
                selected={activeView === item.view}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> 
        {renderView()}
      </Box>
    </Box>
  );
}


const openedMixin = (theme: Theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Grid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(3),
  gridTemplateColumns: 'repeat(12, 1fr)',
  marginBottom: theme.spacing(4),
}));

const GridItem = styled('div')<{ gridColumn?: string }>(({ theme, gridColumn }) => ({
  gridColumn: gridColumn || 'span 4',
}));


const DashboardView = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalCategories: 0,
    recentUsers: [] as User[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await userService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Thống kê tổng quan
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Stats cards */}
          <Grid>
            <GridItem>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Person color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Tổng người dùng</Typography>
                  </Box>
                  <Typography variant="h3">{stats.totalUsers}</Typography>
                </CardContent>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <MenuBook color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Tổng khóa học</Typography>
                  </Box>
                  <Typography variant="h3">{stats.totalCourses}</Typography>
                </CardContent>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Class color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Tổng danh mục</Typography>
                  </Box>
                  <Typography variant="h3">{stats.totalCategories}</Typography>
                </CardContent>
              </Card>
            </GridItem>
          </Grid>

          {/* Recent users */}
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Người dùng gần đây
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Họ tên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Vai trò</TableCell>
                  <TableCell>Ngày đăng ký</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.recentUsers.length > 0 ? (
                  stats.recentUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.profileName || 'Không có tên'}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</TableCell>
                      <TableCell>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Không có người dùng nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

const UsersView = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // User form state
  const [email, setEmail] = useState('');
  const [profileName, setProfileName] = useState('');
  const [role, setRole] = useState('user');
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error: any) {
      console.error('Error loading users:', error);
      showSnackbar(error.message || 'Không thể tải danh sách người dùng', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setProfileName('');
    setRole('user');
    setVerified(false);
    setIsEditing(false);
    setEditingUser(null);
  };

  const handleOpenEditDialog = (user: User) => {
    setIsEditing(true);
    setEditingUser(user);
    
    // Log the user object for debugging
    console.log("Opening edit dialog for user:", user);
    
    // Populate form with user data
    setEmail(user.email);
    setProfileName(user.profileName || '');
    setRole(user.role || 'user');
    setVerified(user.verified || false);
    
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    // Validate form data
    if (!email || !profileName) {
      showSnackbar('Vui lòng điền đầy đủ thông tin người dùng', 'error');
      return;
    }

    try {
      if (isEditing && editingUser?._id) {
        console.log('Sending user update:', {
          email,
          profileName,
          role,
          verified
        });
        
        const result = await userService.updateUser(editingUser._id, {
          email,
          profileName,
          role: role === "admin" ? "admin" : "user",
          verified
        });
        
        showSnackbar('Người dùng đã được cập nhật thành công', 'success');
        
        // Refresh user list after update
        fetchUsers();
      }
      
      setOpenDialog(false);
      resetForm();
    } catch (error: any) {
      console.error('Error saving user:', error);
      showSnackbar(error.message || 'Không thể lưu người dùng', 'error');
    }
  };

  const openDeleteConfirm = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleDeleteUser = async () => {
    if (!confirmDeleteId) return;

    try {
      await userService.deleteUser(confirmDeleteId);
      setUsers(users.filter((user) => user._id !== confirmDeleteId));
      setConfirmDeleteId(null);
      showSnackbar('Người dùng đã được xóa thành công', 'success');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      showSnackbar(error.message || 'Không thể xóa người dùng', 'error');
      setConfirmDeleteId(null);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.profileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Quản lý người dùng
      </Typography>
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField 
          label="Tìm kiếm người dùng" 
          variant="outlined" 
          size="small" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
      </Box>
      
      {/* Users table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress size={24} sx={{ my: 2 }} />
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Không tìm thấy người dùng nào</TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user._id}</TableCell>
                  <TableCell>{user.profileName || 'Không có tên'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</TableCell>
                  <TableCell>{user.verified ? 'Đã xác thực' : 'Chưa xác thực'}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleOpenEditDialog(user)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => openDeleteConfirm(user._id!)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit User Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Chỉnh sửa thông tin người dùng
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <TextField
              label="Họ tên"
              fullWidth
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              required
            />
            
            <FormControl fullWidth>
              <InputLabel>Vai trò</InputLabel>
              <Select
                value={role === "admin" ? "admin" : "user"}
                onChange={(e) => setRole(e.target.value)}
                label="Vai trò"
              >
                <MenuItem value="user">Người dùng</MenuItem>
                <MenuItem value="admin">Quản trị viên</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Trạng thái xác thực</InputLabel>
              <Select
                value={verified ? "true" : "false"}
                onChange={(e) => setVerified(e.target.value === 'true')}
                label="Trạng thái xác thực"
              >
                <MenuItem value="true">Đã xác thực</MenuItem>
                <MenuItem value="false">Chưa xác thực</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)}>Hủy</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={5000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const CoursesView = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  // New course form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState<number>(0);
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [roadmap, setRoadmap] = useState([]);

  // Load courses and categories on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (error: any) {
      console.error('Error loading courses:', error);
      showSnackbar(error.message || 'Không thể tải danh sách khóa học', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDuration(0);
    setContent('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsEditing(false);
    setEditingCourse(null);
    setRoadmap([]);
  };

  const handleOpenCreateDialog = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (course: Course) => {
    setIsEditing(true);
    setEditingCourse(course);
    
    // Populate form with course data
    setTitle(course.title);
    setDescription(course.description);
    setDuration(course.duration);
    setContent(course.content);
    setSelectedFile(null);
    setRoadmap(course.roadmap || []);
    
    setOpenDialog(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    // Validate form data
    if (!title || !description || !content || duration <= 0) {
      showSnackbar('Vui lòng điền đầy đủ thông tin khóa học', 'error');
      return;
    }

    if (!isEditing && !selectedFile) {
      showSnackbar('Vui lòng chọn hình ảnh cho khóa học', 'error');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('duration', duration.toString());
      formData.append('content', content);

      // Parse roadmap JSON
      if (roadmap) {
        try {
          formData.append('roadmap', JSON.stringify(roadmap));
        } catch (err) {
          showSnackbar('Roadmap không hợp lệ (phải là JSON)', 'error');
          return;
        }
      }

      if (selectedFile) {
        formData.append('headerImage', selectedFile);
      }

      if (isEditing && editingCourse?._id) {
        const result = await courseService.updateCourse(editingCourse._id, formData);
        showSnackbar('Khóa học đã được cập nhật thành công', 'success');
        setCourses(
          courses.map((course) => (course._id === result._id ? result : course))
        );
      } else {
        const result = await courseService.createCourse(formData);
        showSnackbar('Khóa học đã được tạo thành công', 'success');
        setCourses([...courses, result]);
      }
      
      setOpenDialog(false);
      resetForm();
    } catch (error: any) {
      console.error('Error saving course:', error);
      showSnackbar(error.message || 'Không thể lưu khóa học', 'error');
    }
  };

  const openDeleteConfirm = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleDeleteCourse = async () => {
    if (!confirmDeleteId) return;

    try {
      await courseService.deleteCourse(confirmDeleteId);
      setCourses(courses.filter((course) => course._id !== confirmDeleteId));
      setConfirmDeleteId(null);
      showSnackbar('Khóa học đã được xóa thành công', 'success');
    } catch (error: any) {
      console.error('Error deleting course:', error);
      showSnackbar(error.message || 'Không thể xóa khóa học', 'error');
      setConfirmDeleteId(null);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Quản lý khóa học
      </Typography>
      
      {/* Add new course button */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField 
          label="Tìm kiếm khóa học" 
          variant="outlined" 
          size="small" 
        />
        <Button 
          variant="contained"  
          startIcon={<Add />}
          onClick={handleOpenCreateDialog}
        >
          Thêm khóa học
        </Button>
      </Box>
      
      {/* Courses table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên khóa học</TableCell>
              <TableCell>Thời lượng</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress size={24} sx={{ my: 2 }} />
                </TableCell>
              </TableRow>
            ) : courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Chưa có khóa học nào</TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell>{course._id}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.duration} giờ</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleOpenEditDialog(course)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => openDeleteConfirm(course._id!)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Course Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {isEditing ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Tên khóa học"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            
            <TextField
              label="Mô tả khóa học"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
      
            <TextField
              label="Thời lượng (giờ)"
              fullWidth
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              required
            />
            
            <TextField
              label="Nội dung khóa học"
              fullWidth
              multiline
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            
            <Box>
              <Button
                component="label"
                variant="outlined"
                startIcon={<Upload />}
              >
                {isEditing ? 'Cập nhật hình ảnh' : 'Chọn hình ảnh khóa học'}
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              {selectedFile && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Đã chọn: {selectedFile.name}
                </Typography>
              )}
              {isEditing && !selectedFile && (
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  Bỏ qua nếu không cần thay đổi hình ảnh
                </Typography>
              )}
            </Box>
            <RoadmapEditor roadmap={roadmap} setRoadmap={setRoadmap} courseId={editingCourse?._id}  />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {isEditing ? 'Cập nhật' : 'Tạo khóa học'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa khóa học này? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)}>Hủy</Button>
          <Button onClick={handleDeleteCourse} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={5000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const CategoriesView = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error: any) {
      console.error('Error loading categories:', error);
      showSnackbar(error.message || 'Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      showSnackbar('Tên danh mục không được để trống', 'error');
      return;
    }
    if(!newCategoryDescription.trim()) {
      showSnackbar('Mô tả không được để trống', 'error');
      return;
    }

    try {
      const newCategory = await categoryService.createCategory({
        name: newCategoryName,
        description: newCategoryDescription || undefined,
      });
      
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
      setNewCategoryDescription('');
      showSnackbar('Thêm danh mục thành công', 'success');
    } catch (error: any) {
      showSnackbar(error.message || 'Không thể thêm danh mục', 'error');
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setOpenDialog(true);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      showSnackbar('Tên danh mục không được để trống', 'error');
      return;
    }

    try {
      const updatedCategory = await categoryService.updateCategory(
        editingCategory._id!,
        {
          name: editingCategory.name,
          description: editingCategory.description || undefined,
        }
      );
      
      setCategories(
        categories.map((cat) => (cat._id === updatedCategory._id ? updatedCategory : cat))
      );
      setOpenDialog(false);
      showSnackbar('Cập nhật danh mục thành công', 'success');
    } catch (error: any) {
      showSnackbar(error.message || 'Không thể cập nhật danh mục', 'error');
    }
  };

  const openDeleteConfirm = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleDeleteCategory = async () => {
    if (!confirmDeleteId) return;

    try {
      await categoryService.deleteCategory(confirmDeleteId);
      setCategories(categories.filter((cat) => cat._id !== confirmDeleteId));
      setConfirmDeleteId(null);
      showSnackbar('Xóa danh mục thành công', 'success');
    } catch (error: any) {
      showSnackbar(error.message || 'Không thể xóa danh mục', 'error');
      setConfirmDeleteId(null);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingCategory) {
      setEditingCategory({
        ...editingCategory,
        name: e.target.value
      });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingCategory) {
      setEditingCategory({
        ...editingCategory,
        description: e.target.value
      });
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Quản lý danh mục
      </Typography>
      
      {/* Add new category */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Thêm danh mục mới
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField 
            label="Tên danh mục" 
            variant="outlined" 
            size="small" 
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
          />
          <TextField 
            label="Mô tả" 
            variant="outlined" 
            required
            size="small" 
            multiline
            rows={2}
            value={newCategoryDescription}
            onChange={(e) => setNewCategoryDescription(e.target.value)}
          />
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={handleCreateCategory}
            sx={{ maxWidth: 200 }}
          >
            Thêm danh mục
          </Button>
        </Box>
      </Paper>
      
      {/* Categories list */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên danh mục</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Đang tải...</TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Không có danh mục nào</TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>{category._id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description || '—'}</TableCell>
                  <TableCell>
                    {category.createdAt 
                      ? new Date(category.createdAt).toLocaleDateString('vi-VN') 
                      : '—'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => openEditDialog(category)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => openDeleteConfirm(category._id!)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit category dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
              label="Tên danh mục" 
              variant="outlined" 
              fullWidth
              value={editingCategory?.name || ''}
              onChange={handleNameChange}
              required
            />
            <TextField 
              label="Mô tả (tùy chọn)" 
              variant="outlined" 
              multiline
              rows={3}
              fullWidth
              value={editingCategory?.description || ''}
              onChange={handleDescriptionChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleUpdateCategory} variant="contained">Lưu thay đổi</Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)}>Hủy</Button>
          <Button onClick={handleDeleteCategory} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={5000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};