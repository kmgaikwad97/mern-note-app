// src/pages/LoginPage.jsx
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box, Container, Grid, Typography, TextField, Button, Alert,
  Link, CircularProgress, InputAdornment, IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError("Please fill in all fields.");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/blogs");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "background.default" }}>
      <Grid container sx={{ flex: 1, maxWidth: 960, mx: "auto", my: { xs: 0, md: 4 }, borderRadius: { md: 5 }, overflow: "hidden", boxShadow: { md: 5 } }}>

        {/* ─── Left dark panel ─── */}
        <Grid item xs={12} md={5} sx={{
          bgcolor: "#1a1a1a", p: { xs: 4, md: 6 },
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          minHeight: { xs: 200, md: "auto" }, position: "relative", overflow: "hidden",
        }}>
          {/* Decorative circles */}
          <Box sx={{ position: "absolute", top: -80, right: -80, width: 240, height: 240, borderRadius: "50%", bgcolor: "rgba(200,134,42,0.1)" }} />
          <Box sx={{ position: "absolute", bottom: -60, left: -60, width: 180, height: 180, borderRadius: "50%", bgcolor: "rgba(200,134,42,0.06)" }} />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: { xs: 2, md: 8 } }}>
              <AutoStoriesIcon sx={{ color: "secondary.main" }} />
              <Typography variant="h6" fontWeight={800} color="white">DevBlog</Typography>
            </Box>
            <Typography variant="h3" fontWeight={800} color="white" sx={{ lineHeight: 1.15, letterSpacing: "-0.03em", display: { xs: "none", md: "block" } }}>
              Great to<br />see you<br /><Box component="span" sx={{ color: "secondary.light", fontStyle: "italic", fontWeight: 300 }}>again.</Box>
            </Typography>
          </Box>
          <Typography variant="body2" color="rgba(255,255,255,0.4)" sx={{ position: "relative", zIndex: 1, display: { xs: "none", md: "block" } }}>
            Your notes and the full library are waiting.
          </Typography>
        </Grid>

        {/* ─── Right form panel ─── */}
        <Grid item xs={12} md={7} sx={{ bgcolor: "white", p: { xs: 4, md: 6 }, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Typography variant="h4" fontWeight={800} mb={0.5} sx={{ letterSpacing: "-0.03em" }}>Sign In</Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            New here?{" "}
            <Link component={RouterLink} to="/register" sx={{ color: "secondary.main", fontWeight: 600, textDecoration: "none" }}>
              Create a free account
            </Link>
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              label="Email" name="email" type="email"
              value={form.email} onChange={handleChange}
              fullWidth autoComplete="email"
              placeholder="you@example.com"
            />
            <TextField
              label="Password" name="password"
              type={showPwd ? "text" : "password"}
              value={form.password} onChange={handleChange}
              fullWidth autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPwd(!showPwd)} edge="end">
                      {showPwd ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}
              sx={{ mt: 1, bgcolor: "text.primary", "&:hover": { bgcolor: "grey.800" }, height: 52 }}>
              {loading ? <CircularProgress size={22} sx={{ color: "white" }} /> : "Sign In"}
            </Button>
          </Box>

          <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid", borderColor: "divider" }}>
            <Button fullWidth variant="outlined" component={RouterLink} to="/"
              sx={{ borderColor: "divider", color: "text.secondary" }}>
              ← Back to Home
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
