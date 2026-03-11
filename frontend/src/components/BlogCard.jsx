// src/components/BlogCard.jsx
import {
  Card, CardMedia, CardContent, Box, Typography, Chip, Avatar,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

export default function BlogCard({ blog, onClick, locked = false }) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid",
        borderColor: "divider",
        "&:hover": { borderColor: "transparent" },
      }}
    >
      {/* Image */}
      <Box sx={{ position: "relative", overflow: "hidden", height: 200 }}>
        <CardMedia
          component="img"
          image={blog.image}
          alt={blog.title}
          sx={{ height: "100%", objectFit: "cover", transition: "transform 0.5s ease", ".MuiCard-root:hover &": { transform: "scale(1.05)" } }}
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${blog.id}/800/450`; }}
        />
        {/* Category chip overlay */}
        <Chip
          label={blog.category}
          size="small"
          sx={{
            position: "absolute", top: 12, left: 12,
            bgcolor: "secondary.main", color: "white",
            fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.05em",
          }}
        />
        {/* Lock overlay */}
        {locked && (
          <Box sx={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)",
            p: 1.5, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 0.5,
          }}>
            <LockIcon sx={{ color: "white", fontSize: 14 }} />
            <Typography variant="caption" sx={{ color: "white", fontWeight: 600 }}>Members Only</Typography>
          </Box>
        )}
      </Box>

      {/* Content */}
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2.5 }}>
        {/* Author + date */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <Avatar sx={{ width: 24, height: 24, bgcolor: "secondary.light", fontSize: "0.65rem", fontWeight: 700 }}>
            {blog.author?.[0]}
          </Avatar>
          <Typography variant="caption" fontWeight={600} color="text.secondary">{blog.author}</Typography>
          <Typography variant="caption" color="divider">·</Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(blog.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </Typography>
        </Box>

        <Typography variant="h6" fontWeight={700} mb={1} sx={{ fontSize: "1rem", lineHeight: 1.35, letterSpacing: "-0.01em" }}>
          {blog.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{
          flex: 1, lineHeight: 1.65,
          display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
          mb: 2,
        }}>
          {blog.shortDescription}
        </Typography>

        <Typography variant="caption" fontWeight={700} sx={{ color: "secondary.main", ".MuiCard-root:hover &": { color: "text.primary" }, transition: "color 0.2s" }}>
          {locked ? "Login to read →" : "Read more →"}
        </Typography>
      </CardContent>
    </Card>
  );
}
