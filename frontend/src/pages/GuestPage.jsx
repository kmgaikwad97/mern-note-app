// src/pages/GuestPage.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Container, Typography, Button, Grid, Skeleton,
  Stack, Paper, Divider,
} from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import SecurityIcon from "@mui/icons-material/Security";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import BlogCard from "../components/BlogCard";
import AuthModal from "../components/AuthModal";

const FEATURES = [
  { icon: <AutoStoriesIcon fontSize="large" />, title: "In-depth Guides", desc: "Not tutorials. Real explanations with working code and proper architecture." },
  { icon: <NoteAltIcon fontSize="large" />, title: "Personal Notes", desc: "Save your insights with a full CRUD notes dashboard — only yours." },
  { icon: <SecurityIcon fontSize="large" />, title: "Secure Auth", desc: "JWT + refresh tokens the right way — explained and implemented in code." },
];

export default function GuestPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const blogsRef = useRef(null);
  const scrollTriggered = useRef(false);

  useEffect(() => {
    api.get("/blogs").then((r) => setBlogs(r.data.data.blogs)).catch(console.error).finally(() => setLoading(false));
  }, []);

  // Show modal after scrolling 55% down the page
  useEffect(() => {
    if (isAuthenticated) return;
    const onScroll = () => {
      if (scrollTriggered.current) return;
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (pct > 0.55) { scrollTriggered.current = true; setModalOpen(true); }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isAuthenticated]);

  const handleCardClick = () => isAuthenticated ? navigate("/blogs") : setModalOpen(true);

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      {/* ─── HERO ─────────────────────────────────────────── */}
      <Box sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #faf8f5 0%, #f3ede4 100%)",
      }}>
        {/* Giant decorative text */}
        <Typography sx={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: { xs: "120px", md: "220px" },
          fontWeight: 900, color: "rgba(0,0,0,0.04)",
          letterSpacing: "-0.06em", userSelect: "none",
          whiteSpace: "nowrap", lineHeight: 1,
        }}>
          CODE
        </Typography>

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ maxWidth: 680, py: { xs: 12, md: 16 } }}>
            {/* Badge */}
            <Box sx={{
              display: "inline-flex", alignItems: "center", gap: 1,
              bgcolor: "#fdf3e3", border: "1px solid rgba(200,134,42,0.25)",
              borderRadius: 100, px: 2, py: 0.75, mb: 4,
            }}>
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "secondary.main", animation: "pulse 2s infinite" }} />
              <Typography variant="caption" fontWeight={700} sx={{ color: "secondary.main", letterSpacing: "0.04em" }}>
                NEW ARTICLES EVERY WEEK
              </Typography>
            </Box>

            <Typography variant="h1" sx={{ fontSize: { xs: "2.8rem", sm: "4rem", md: "5.5rem" }, mb: 3, letterSpacing: "-0.04em" }}>
              Where devs
              <Box component="span" sx={{ color: "secondary.main", fontStyle: "italic", fontWeight: 300 }}> learn</Box>
              <br />& level up
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.1rem", lineHeight: 1.75, mb: 5, maxWidth: 520 }}>
              Deep dives into JavaScript, React, Node.js, and MongoDB — written by practitioners, for practitioners.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={6}>
              <Button variant="contained" size="large" onClick={() => navigate("/register")}
                sx={{ bgcolor: "text.primary", "&:hover": { bgcolor: "grey.800" }, px: 5 }}>
                Start Reading Free
              </Button>
              <Button variant="outlined" size="large" onClick={() => blogsRef.current?.scrollIntoView({ behavior: "smooth" })}
                sx={{ borderColor: "divider", color: "text.primary", px: 4 }}>
                Preview Articles ↓
              </Button>
            </Stack>

            {/* Stats */}
            <Stack direction="row" spacing={4} divider={<Divider orientation="vertical" flexItem />}>
              {[["6+", "Articles"], ["100%", "Free"], ["MERN", "Focused"]].map(([val, label]) => (
                <Box key={label}>
                  <Typography variant="h5" fontWeight={800} color="text.primary">{val}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* ─── BLOG PREVIEWS ───────────────────────────────── */}
      <Box ref={blogsRef} sx={{ py: { xs: 8, md: 12 }, bgcolor: "#f3ede4" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "3rem" }, mb: 1.5, letterSpacing: "-0.03em" }}>
              Latest Articles
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Click any article to read the full content — members only.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {loading
              ? [1, 2, 3].map((i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Skeleton variant="rounded" height={340} sx={{ borderRadius: 3 }} />
                  </Grid>
                ))
              : blogs.map((blog) => (
                  <Grid item xs={12} sm={6} md={4} key={blog.id}>
                    <BlogCard blog={blog} onClick={handleCardClick} locked={!isAuthenticated} />
                  </Grid>
                ))
            }
          </Grid>

          {/* CTA box below cards */}
          {!isAuthenticated && !loading && (
            <Paper elevation={0} sx={{ mt: 6, p: { xs: 4, md: 6 }, textAlign: "center", borderRadius: 4, border: "1px solid", borderColor: "divider", bgcolor: "white" }}>
              <Typography variant="h4" fontWeight={800} mb={1.5} sx={{ letterSpacing: "-0.02em" }}>
                Enjoying the previews?
              </Typography>
              <Typography color="text.secondary" mb={4}>
                Create a free account to read every article in full.
              </Typography>
              <Button variant="contained" size="large" onClick={() => setModalOpen(true)}
                sx={{ bgcolor: "secondary.main", "&:hover": { bgcolor: "secondary.dark" }, px: 5 }}>
                Unlock Full Access
              </Button>
            </Paper>
          )}
        </Container>
      </Box>

      {/* ─── FEATURES ────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, borderTop: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {FEATURES.map((f) => (
              <Grid item xs={12} md={4} key={f.title}>
                <Paper elevation={0} sx={{ p: 4, border: "1px solid", borderColor: "divider", borderRadius: 3, height: "100%", transition: "all 0.3s", "&:hover": { boxShadow: 4, transform: "translateY(-4px)", borderColor: "transparent" } }}>
                  <Box sx={{ color: "secondary.main", mb: 2 }}>{f.icon}</Box>
                  <Typography variant="h6" fontWeight={700} mb={1}>{f.title}</Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{f.desc}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <AuthModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </Box>
  );
}
