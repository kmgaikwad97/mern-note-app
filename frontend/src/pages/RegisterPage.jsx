// src/pages/RegisterPage.jsx
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box, Grid, Typography, TextField, Button, Alert, Link,
  CircularProgress, InputAdornment, IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = form;
    if (!name || !email || !password || !confirmPassword) return setError("Please fill in all fields.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/blogs");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "background.default" }}>
      <Grid container sx={{ flex: 1, maxWidth: 960, mx: "auto", my: { xs: 0, md: 4 }, borderRadius: { md: 5 }, overflow: "hidden", boxShadow: { md: 5 } }}>

        {/* Left panel */}
        <Grid item xs={12} md={5} sx={{
          background: "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)",
          p: { xs: 4, md: 6 }, display: "flex", flexDirection: "column", justifyContent: "space-between",
          minHeight: { xs: 200, md: "auto" }, position: "relative", overflow: "hidden",
        }}>
          <Box sx={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", bgcolor: "rgba(200,134,42,0.12)" }} />
          <Box sx={{ position: "absolute", bottom: -80, left: -80, width: 240, height: 240, borderRadius: "50%", bgcolor: "rgba(200,134,42,0.07)" }} />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: { xs: 2, md: 8 } }}>
              <AutoStoriesIcon sx={{ color: "secondary.main" }} />
              <Typography variant="h6" fontWeight={800} color="white">DevBlog</Typography>
            </Box>
            <Typography variant="h3" fontWeight={800} color="white" sx={{ lineHeight: 1.15, letterSpacing: "-0.03em", display: { xs: "none", md: "block" } }}>
              Join the<br /><Box component="span" sx={{ color: "secondary.light", fontStyle: "italic", fontWeight: 300 }}>community</Box><br />today.
            </Typography>
          </Box>
          <Box sx={{ position: "relative", zIndex: 1, display: { xs: "none", md: "flex" }, flexDirection: "column", gap: 1 }}>
            {["✓ Full blog access", "✓ Personal notes dashboard", "✓ Free forever"].map((t) => (
              <Typography key={t} variant="body2" color="rgba(255,255,255,0.5)">{t}</Typography>
            ))}
          </Box>
        </Grid>

        {/* Right form panel */}
        <Grid item xs={12} md={7} sx={{ bgcolor: "white", p: { xs: 4, md: 6 }, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Typography variant="h4" fontWeight={800} mb={0.5} sx={{ letterSpacing: "-0.03em" }}>Create Account</Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Already have one?{" "}
            <Link component={RouterLink} to="/login" sx={{ color: "secondary.main", fontWeight: 600, textDecoration: "none" }}>
              Sign in instead
            </Link>
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField label="Full Name" name="name" value={form.name} onChange={handleChange} fullWidth placeholder="Jane Doe" autoComplete="name" />
            <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth placeholder="you@example.com" autoComplete="email" />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Password" name="password" type={showPwd ? "text" : "password"}
                  value={form.password} onChange={handleChange} fullWidth placeholder="Min. 6 chars"
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPwd(!showPwd)} edge="end" size="small">
                          {showPwd ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Confirm" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} fullWidth placeholder="Repeat password" autoComplete="new-password" />
              </Grid>
            </Grid>

            <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}
              sx={{ mt: 1, bgcolor: "text.primary", "&:hover": { bgcolor: "grey.800" }, height: 52 }}>
              {loading ? <CircularProgress size={22} sx={{ color: "white" }} /> : "Create Account"}
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
