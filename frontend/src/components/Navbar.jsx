// src/components/Navbar.jsx
import { useState } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, Button, IconButton, Box, Avatar,
  Drawer, List, ListItem, ListItemButton, ListItemText, Divider,
  useMediaQuery, useTheme, Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { label: "Home", path: "/", public: true },
  { label: "Blogs", path: "/blogs", public: false },
  { label: "My Notes", path: "/notes", public: false },
];

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    setDrawerOpen(false);
    await logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const visibleLinks = NAV_LINKS.filter((l) => l.public || isAuthenticated);

  // ─── Mobile Drawer ────────────────────────────────────────
  const drawer = (
    <Box sx={{ width: 280, height: "100%", bgcolor: "background.default" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AutoStoriesIcon sx={{ color: "secondary.main" }} />
          <Typography variant="h6" fontWeight={800} color="text.primary">DevBlog</Typography>
        </Box>
        <IconButton onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
      </Box>

      {user && (
        <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5, bgcolor: "grey.50" }}>
          <Avatar sx={{ bgcolor: "secondary.main", width: 36, height: 36, fontSize: "0.9rem", fontWeight: 700 }}>
            {user.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
            <Chip label={user.role} size="small" sx={{ fontSize: "0.65rem", height: 18 }} />
          </Box>
        </Box>
      )}

      <List sx={{ p: 1 }}>
        {visibleLinks.map((link) => (
          <ListItem key={link.path} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={link.path}
              onClick={() => setDrawerOpen(false)}
              selected={isActive(link.path)}
              sx={{
                borderRadius: 2, mb: 0.5,
                "&.Mui-selected": { bgcolor: "secondary.main", color: "white", "&:hover": { bgcolor: "secondary.dark" } },
              }}
            >
              <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />
      <Box sx={{ p: 2 }}>
        {isAuthenticated ? (
          <Button fullWidth variant="outlined" color="error" onClick={handleLogout}>Logout</Button>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button fullWidth variant="outlined" component={RouterLink} to="/login" onClick={() => setDrawerOpen(false)}>Sign In</Button>
            <Button fullWidth variant="contained" sx={{ bgcolor: "secondary.main" }} component={RouterLink} to="/register" onClick={() => setDrawerOpen(false)}>Get Started</Button>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" color="transparent" elevation={0}>
        <Toolbar sx={{ maxWidth: 1200, width: "100%", mx: "auto", px: { xs: 2, md: 3 } }}>
          {/* Logo */}
          <Box component={RouterLink} to="/" sx={{ display: "flex", alignItems: "center", gap: 1, textDecoration: "none", mr: 4 }}>
            <AutoStoriesIcon sx={{ color: "secondary.main", fontSize: 24 }} />
            <Typography variant="h6" fontWeight={800} color="text.primary" sx={{ letterSpacing: "-0.03em" }}>
              DevBlog
            </Typography>
          </Box>

          {/* Desktop nav links */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 0.5, flex: 1 }}>
              {visibleLinks.map((link) => (
                <Button
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  size="small"
                  sx={{
                    color: isActive(link.path) ? "text.primary" : "text.secondary",
                    fontWeight: isActive(link.path) ? 700 : 500,
                    bgcolor: isActive(link.path) ? "grey.100" : "transparent",
                    "&:hover": { bgcolor: "grey.100", color: "text.primary" },
                    borderRadius: 2,
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
            {!isMobile && (
              isAuthenticated ? (
                <>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, py: 0.75, borderRadius: 2, bgcolor: "grey.50", border: "1px solid", borderColor: "divider" }}>
                    <Avatar sx={{ bgcolor: "secondary.main", width: 28, height: 28, fontSize: "0.8rem", fontWeight: 700 }}>
                      {user?.name?.[0]?.toUpperCase()}
                    </Avatar>
                    <Typography variant="body2" fontWeight={600} color="text.primary">
                      {user?.name?.split(" ")[0]}
                    </Typography>
                  </Box>
                  <Button size="small" variant="outlined" color="inherit" onClick={handleLogout} sx={{ borderColor: "divider", color: "text.secondary" }}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button size="small" component={RouterLink} to="/login" sx={{ color: "text.secondary" }}>Sign In</Button>
                  <Button size="small" variant="contained" component={RouterLink} to="/register" sx={{ bgcolor: "secondary.main", "&:hover": { bgcolor: "secondary.dark" } }}>
                    Get Started
                  </Button>
                </>
              )
            )}
            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(true)} edge="end">
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { borderRadius: "20px 0 0 20px" } }}>
        {drawer}
      </Drawer>
    </>
  );
}
