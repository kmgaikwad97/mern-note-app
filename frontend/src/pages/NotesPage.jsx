// src/pages/NotesPage.jsx
import { useState, useEffect } from "react";
import {
  Box, Container, Typography, Button, Grid, Card, CardContent, CardActions,
  TextField, Alert, Chip, IconButton, Skeleton, Dialog, DialogTitle,
  DialogContent, DialogActions, Collapse, Tooltip, Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

// ─── Note Form Dialog ─────────────────────────────────────────
function NoteDialog({ open, onClose, onSubmit, initial, loading }) {
  const [form, setForm] = useState(initial || { title: "", content: "" });
  const isEdit = !!initial;

  useEffect(() => { setForm(initial || { title: "", content: "" }); }, [initial, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <Box sx={{ height: 4, background: "linear-gradient(90deg, #c8862a, #e9a94a)" }} />
      <DialogTitle sx={{ fontWeight: 800, letterSpacing: "-0.02em", pt: 3 }}>
        {isEdit ? "✏️ Edit Note" : "✦ New Note"}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}>
          <TextField
            label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            fullWidth autoFocus inputProps={{ maxLength: 100 }}
            helperText={`${form.title.length}/100`}
          />
          <TextField
            label="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
            fullWidth multiline rows={5} placeholder="Write your note here..."
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderColor: "divider", color: "text.secondary" }}>Cancel</Button>
        <Button
          onClick={() => onSubmit(form)} variant="contained"
          disabled={loading || !form.title.trim() || !form.content.trim()}
          sx={{ bgcolor: "text.primary", "&:hover": { bgcolor: "grey.800" }, minWidth: 120 }}
        >
          {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Note"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Single Note Card ─────────────────────────────────────────
function NoteCard({ note, onEdit, onDelete, deleting }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = note.content.length > 150;

  return (
    <Card sx={{
      height: "100%", display: "flex", flexDirection: "column",
      border: "1px solid", borderColor: "divider",
      position: "relative", overflow: "hidden",
      "&::before": {
        content: '""', position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: "linear-gradient(90deg, #c8862a, transparent)",
        opacity: 0, transition: "opacity 0.3s",
      },
      "&:hover::before": { opacity: 1 },
    }}>
      <CardContent sx={{ flex: 1, pb: 1 }}>
        <Typography variant="h6" fontWeight={700} mb={1.5} sx={{ fontSize: "1rem", lineHeight: 1.3, letterSpacing: "-0.01em" }}>
          {note.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" lineHeight={1.7} sx={{
          whiteSpace: "pre-wrap", wordBreak: "break-word",
          ...(!expanded && isLong && { display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }),
        }}>
          {note.content}
        </Typography>

        {isLong && (
          <Button size="small" onClick={() => setExpanded(!expanded)}
            endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{ mt: 1, color: "secondary.main", p: 0, fontSize: "0.78rem", fontWeight: 700, "&:hover": { bgcolor: "transparent" } }}>
            {expanded ? "Show less" : "Show more"}
          </Button>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2, pt: 0 }}>
        <Typography variant="caption" color="text.secondary">
          {new Date(note.updatedAt || note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </Typography>
        <Box sx={{ display: "flex", gap: 0.5, opacity: 0, transition: "opacity 0.2s", ".MuiCard-root:hover &": { opacity: 1 } }}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => onEdit(note)} sx={{ color: "text.secondary", "&:hover": { color: "text.primary", bgcolor: "grey.100" } }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => onDelete(note._id)} disabled={deleting === note._id}
              sx={{ color: "text.secondary", "&:hover": { color: "error.main", bgcolor: "#fdf0ef" } }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function NotesPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [toast, setToast] = useState({ type: "", msg: "" });

  const notify = (type, msg) => { setToast({ type, msg }); setTimeout(() => setToast({ type: "", msg: "" }), 3000); };

  useEffect(() => {
    api.get("/notes").then((r) => setNotes(r.data.data.notes)).catch(() => notify("error", "Could not load notes.")).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (form) => {
    setFormLoading(true);
    try {
      const res = await api.post("/notes", form);
      setNotes([res.data.data.note, ...notes]);
      setDialogOpen(false);
      notify("success", "Note created!");
    } catch (err) {
      notify("error", err.response?.data?.message || "Failed to create note.");
    } finally { setFormLoading(false); }
  };

  const handleUpdate = async (form) => {
    setFormLoading(true);
    try {
      const res = await api.put(`/notes/${editNote._id}`, form);
      setNotes(notes.map((n) => n._id === editNote._id ? res.data.data.note : n));
      setEditNote(null);
      notify("success", "Note updated!");
    } catch (err) {
      notify("error", err.response?.data?.message || "Failed to update.");
    } finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this note? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter((n) => n._id !== id));
      notify("success", "Note deleted.");
    } catch { notify("error", "Failed to delete."); }
    finally { setDeleting(null); }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: { sm: "center" }, justifyContent: "space-between", mb: { xs: 5, md: 7 }, flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
          <Box>
            <Chip label={`Your workspace, ${user?.name?.split(" ")[0]}`} sx={{ mb: 2, bgcolor: "#fdf3e3", color: "secondary.dark", fontWeight: 600, border: "1px solid rgba(200,134,42,0.25)" }} />
            <Typography variant="h2" fontWeight={800} sx={{ fontSize: { xs: "2rem", md: "3.5rem" }, letterSpacing: "-0.04em" }}>My Notes</Typography>
            <Typography color="text.secondary" mt={0.5}>{notes.length} note{notes.length !== 1 ? "s" : ""}</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditNote(null); setDialogOpen(true); }}
            sx={{ bgcolor: "secondary.main", "&:hover": { bgcolor: "secondary.dark" }, flexShrink: 0, height: 48 }}>
            New Note
          </Button>
        </Box>

        {/* Toast alerts */}
        <Collapse in={!!toast.msg}>
          {toast.msg && <Alert severity={toast.type === "success" ? "success" : "error"} sx={{ mb: 3, borderRadius: 2 }}>{toast.msg}</Alert>}
        </Collapse>

        {/* Notes grid */}
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3].map((i) => <Grid item xs={12} sm={6} md={4} key={i}><Skeleton variant="rounded" height={200} sx={{ borderRadius: 3 }} /></Grid>)}
          </Grid>
        ) : notes.length === 0 ? (
          <Paper elevation={0} sx={{ textAlign: "center", p: { xs: 6, md: 10 }, border: "2px dashed", borderColor: "divider", borderRadius: 4 }}>
            <NoteAltIcon sx={{ fontSize: 48, color: "divider", mb: 2 }} />
            <Typography variant="h5" fontWeight={700} mb={1}>No notes yet</Typography>
            <Typography color="text.secondary" mb={4}>Create your first note to get started.</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}
              sx={{ bgcolor: "text.primary", "&:hover": { bgcolor: "grey.800" } }}>
              Create First Note
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {notes.map((note) => (
              <Grid item xs={12} sm={6} md={4} key={note._id}>
                <NoteCard note={note} onEdit={(n) => { setEditNote(n); setDialogOpen(true); }} onDelete={handleDelete} deleting={deleting} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Create / Edit Dialog */}
      <NoteDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditNote(null); }}
        onSubmit={editNote ? handleUpdate : handleCreate}
        initial={editNote ? { title: editNote.title, content: editNote.content } : null}
        loading={formLoading}
      />
    </Box>
  );
}
