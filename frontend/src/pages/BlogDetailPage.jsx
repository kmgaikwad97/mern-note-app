// src/pages/BlogDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Container, Typography, Button, Chip, Avatar, Skeleton, Alert, Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import api from "../api/axiosInstance";

export default function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/blogs/${id}`).then((r) => setBlog(r.data.data.blog)).catch(() => setError("Article not found.")).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="md">
        <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3, mb: 4 }} />
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} sx={{ mb: 1.5 }} height={24} width={i % 2 === 0 ? "60%" : "100%"} />)}
      </Container>
    </Box>
  );

  if (error) return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/blogs")}>Back to Library</Button>
      </Container>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/blogs")}
          sx={{ mb: 4, color: "text.secondary", "&:hover": { color: "text.primary" } }}>
          Back to Library
        </Button>

        {/* Hero image */}
        <Box sx={{ borderRadius: 4, overflow: "hidden", height: { xs: 220, md: 420 }, mb: 5, position: "relative" }}>
          <Box component="img" src={blog.image} alt={blog.title}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { e.target.src = `https://picsum.photos/seed/${blog.id}/1200/500`; }}
          />
          <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(250,248,245,0.9) 100%)" }} />
        </Box>

        {/* Meta */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mb: 2.5 }}>
          <Chip label={blog.category} size="small" sx={{ bgcolor: "#fdf3e3", color: "secondary.dark", fontWeight: 700, fontSize: "0.7rem" }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, bgcolor: "secondary.light", fontSize: "0.65rem" }}>{blog.author?.[0]}</Avatar>
            <Typography variant="caption" fontWeight={600} color="text.secondary">{blog.author}</Typography>
          </Box>
          <Typography variant="caption" color="divider">·</Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(blog.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </Typography>
        </Box>

        <Typography variant="h3" fontWeight={800} mb={2.5} sx={{ lineHeight: 1.15, letterSpacing: "-0.03em", fontSize: { xs: "1.75rem", md: "2.5rem" } }}>
          {blog.title}
        </Typography>

        {/* Intro quote */}
        <Box sx={{ borderLeft: "3px solid", borderColor: "secondary.main", pl: 3, mb: 5 }}>
          <Typography variant="body1" color="text.secondary" fontStyle="italic" lineHeight={1.75} fontSize="1.05rem">
            {blog.shortDescription}
          </Typography>
        </Box>

        <Box sx={{ height: "1px", bgcolor: "divider", mb: 5 }} />

        {/* Content renderer */}
        <Box sx={{ color: "text.secondary", lineHeight: 1.85, fontSize: "1.05rem" }}>
          {blog.fullContent.split("\n").map((line, i) => {
            if (line.startsWith("## ")) return (
              <Typography key={i} variant="h5" fontWeight={700} mt={5} mb={2} sx={{ color: "text.primary", letterSpacing: "-0.02em" }}>
                {line.slice(3)}
              </Typography>
            );
            if (line.startsWith("```")) return null;
            if (!line.trim()) return <Box key={i} sx={{ mb: 2 }} />;
            return <Typography key={i} variant="body1" paragraph lineHeight={1.85}>{line}</Typography>;
          })}
        </Box>

        {/* CTA */}
        <Paper elevation={0} sx={{ mt: 8, p: { xs: 4, md: 5 }, textAlign: "center", border: "1px solid", borderColor: "divider", borderRadius: 4, bgcolor: "#faf8f5" }}>
          <Typography variant="h5" fontWeight={800} mb={1.5} sx={{ letterSpacing: "-0.02em" }}>Found this useful?</Typography>
          <Typography color="text.secondary" mb={3}>Save your insights in your personal notes dashboard.</Typography>
          <Button variant="contained" startIcon={<NoteAltIcon />} onClick={() => navigate("/notes")}
            sx={{ bgcolor: "secondary.main", "&:hover": { bgcolor: "secondary.dark" }, px: 4 }}>
            Open My Notes
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
