// src/components/AuthModal.jsx
import { useNavigate } from "react-router-dom";
import {
  Dialog, DialogContent, Box, Typography, Button, IconButton, Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function AuthModal({ open, onClose }) {
  const navigate = useNavigate();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}
    >
      {/* Amber accent bar */}
      <Box sx={{ height: 4, background: "linear-gradient(90deg, #c8862a, #e9a94a)" }} />

      <DialogContent sx={{ p: 4, textAlign: "center" }}>
        <IconButton onClick={onClose} sx={{ position: "absolute", top: 12, right: 12, color: "text.secondary" }}>
          <CloseIcon fontSize="small" />
        </IconButton>

        <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: "#fdf3e3", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
          <LockOutlinedIcon sx={{ color: "secondary.main", fontSize: 30 }} />
        </Box>

        <Typography variant="h5" fontWeight={800} mb={1} sx={{ letterSpacing: "-0.02em" }}>
          Members Only
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3} lineHeight={1.7}>
          This content is for registered readers. Create a free account or sign in to enjoy full articles and your personal notes dashboard.
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ bgcolor: "text.primary", "&:hover": { bgcolor: "grey.800" } }}
            onClick={() => { navigate("/register"); onClose(); }}
          >
            Create Free Account
          </Button>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            sx={{ borderColor: "divider", color: "text.primary" }}
            onClick={() => { navigate("/login"); onClose(); }}
          >
            Sign In
          </Button>
        </Box>

        <Divider sx={{ my: 2.5 }} />
        <Typography variant="caption" color="text.secondary">
          Free forever · No credit card required
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
