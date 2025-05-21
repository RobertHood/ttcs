import { useState, useEffect } from 'react';
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
} from '@mui/material';
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
} from '@mui/icons-material';
import { categoryService, type Category } from '../config/categoryService';

const drawerWidth = 240;

export default function AdminPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');

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
        <Toolbar /> {/* Spacer for AppBar */}
        {renderView()}
      </Box>
    </Box>
  );
}

// Style mixins for drawer
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

// Placeholder components for different views
const DashboardView = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Thống kê tổng quan
    </Typography>
    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, minWidth: 200 }}>
        <Typography variant="h6">Tổng người dùng</Typography>
        <Typography variant="h4">1,234</Typography>
      </Box>
      <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, minWidth: 200 }}>
        <Typography variant="h6">Tổng khóa học</Typography>
        <Typography variant="h4">567</Typography>
      </Box>
    </Box>
  </Box>
);

const UsersView = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Quản lý người dùng
    </Typography>
    <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
      <TextField label="Tìm kiếm người dùng" variant="outlined" size="small" />
      <Button variant="contained">Thêm người dùng</Button>
    </Box>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Họ tên</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Vai trò</TableCell>
            <TableCell align="right">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>Nguyễn Văn A</TableCell>
            <TableCell>nguyenvana@example.com</TableCell>
            <TableCell>Quản trị</TableCell>
            <TableCell align="right">
              <Button size="small">Sửa</Button>
              <Button size="small" color="error">Xóa</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

const CoursesView = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Quản lý khóa học
    </Typography>
    <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
      <TextField label="Tìm kiếm khóa học" variant="outlined" size="small" />
      <Button variant="contained">Thêm khóa học</Button>
    </Box>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Tên khóa học</TableCell>
            <TableCell>Danh mục</TableCell>
            <TableCell>Giảng viên</TableCell>
            <TableCell align="right">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>101</TableCell>
            <TableCell>React cơ bản</TableCell>
            <TableCell>Lập trình Web</TableCell>
            <TableCell>Trần Thị B</TableCell>
            <TableCell align="right">
              <Button size="small">Sửa</Button>
              <Button size="small" color="error">Xóa</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

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
      // Clear any previous errors if successful
      if (snackbar.severity === 'error') {
        setSnackbar({ ...snackbar, open: false });
      }
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
            label="Mô tả (tùy chọn)" 
            variant="outlined" 
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