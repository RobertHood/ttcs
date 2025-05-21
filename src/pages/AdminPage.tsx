import { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
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
  useTheme,
} from '@mui/material';
import {
  Menu,
  ChevronLeft,
  Dashboard,
  People,
  LibraryBooks,
  Category,
  BarChart,
  Settings,
} from '@mui/icons-material';

const drawerWidth = 240;

export default function AdminPage() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, view: 'dashboard' },
    { text: 'Người dùng', icon: <People />, view: 'users' },
    { text: 'Khóa học', icon: <LibraryBooks />, view: 'courses' },
    { text: 'Danh mục', icon: <Category />, view: 'categories' },
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

const CategoriesView = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Quản lý danh mục
    </Typography>
    <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
      <TextField label="Tên danh mục mới" variant="outlined" size="small" />
      <Button variant="contained">Thêm danh mục</Button>
    </Box>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Tên danh mục</TableCell>
            <TableCell align="right">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>Lập trình</TableCell>
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