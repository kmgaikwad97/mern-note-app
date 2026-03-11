// src/pages/BlogsPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography, Grid, Skeleton, Button, Chip, Alert } from "@mui/material";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import BlogCard from "../components/BlogCard";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/blogs").then((r) => setBlogs(r.data.data.blogs)).catch(() => setError("Failed to load articles.")).finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: { sm: "center" }, justifyContent: "space-between", mb: { xs: 5, md: 7 }, flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
          <Box>
            <Chip label={`Welcome back, ${user?.name?.split(" ")[0]} 👋`} sx={{ mb: 2, bgcolor: "#fdf3e3", color: "secondary.dark", fontWeight: 600, border: "1px solid rgba(200,134,42,0.25)" }} />
            <Typography variant="h2" fontWeight={800} sx={{ fontSize: { xs: "2rem", md: "3.5rem" }, letterSpacing: "-0.04em" }}>
              The Library
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={0.5}>
              {blogs.length} articles on modern web development
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<NoteAltIcon />} onClick={() => navigate("/notes")}
            sx={{ bgcolor: "secondary.main", "&:hover": { bgcolor: "secondary.dark" }, flexShrink: 0, height: 48 }}>
            My Notes
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

        <Grid container spacing={3}>
          {loading
            ? [1, 2, 3, 4, 5, 6].map((i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Skeleton variant="rounded" height={340} sx={{ borderRadius: 3 }} />
                </Grid>
              ))
            : blogs.map((blog) => (
                <Grid item xs={12} sm={6} md={4} key={blog.id}>
                  <BlogCard blog={blog} onClick={() => navigate(`/blogs/${blog.id}`)} locked={false} />
                </Grid>
              ))
          }
        </Grid>
      </Container>
    </Box>
  );
}
