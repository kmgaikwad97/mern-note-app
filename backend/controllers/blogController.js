// controllers/blogController.js
// Serves static dummy blog data
// Guest sees previews, logged-in users see full content

const { sendSuccess } = require("../utils/responseUtils");

// ─── Dummy Blog Data ──────────────────────────────────────────
// In a real app this would come from a Blog MongoDB model
const BLOGS = [
  {
    id: 1,
    title: "Mastering JavaScript Async/Await",
    author: "Sarah Chen",
    date: "2024-01-15",
    category: "JavaScript",
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop",
    shortDescription:
      "Async/await transformed how we write asynchronous JavaScript. In this deep dive, we explore patterns, pitfalls, and best practices.",
    fullContent: `
      Async/await is syntactic sugar over Promises, making asynchronous code read like synchronous code.
      
      ## Why Async/Await?
      Before async/await, we had callback hell and complex Promise chains. Async/await flattened this into readable, linear code.
      
      ## Basic Pattern
      \`\`\`js
      async function fetchUser(id) {
        try {
          const response = await fetch(\`/api/users/\${id}\`);
          const user = await response.json();
          return user;
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      }
      \`\`\`
      
      ## Parallel Execution with Promise.all
      Don't await sequentially when operations are independent:
      \`\`\`js
      // Slow - sequential
      const user = await fetchUser(id);
      const posts = await fetchPosts(id);
      
      // Fast - parallel
      const [user, posts] = await Promise.all([fetchUser(id), fetchPosts(id)]);
      \`\`\`
      
      ## Error Handling
      Always wrap async functions in try/catch. For cleaner code, create a wrapper utility that returns [data, error] tuples.
      
      Mastering async/await unlocks clean, maintainable async code patterns that are a joy to read and debug.
    `,
  },
  {
    id: 2,
    title: "Building REST APIs with Express.js",
    author: "Marcus Williams",
    date: "2024-01-22",
    category: "Node.js",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop",
    shortDescription:
      "Express.js remains the most popular Node.js framework. Learn to build production-grade REST APIs with proper structure and best practices.",
    fullContent: `
      Express.js is minimal and flexible, making it perfect for REST APIs. Here's how to structure one properly.
      
      ## Project Structure
      A clean Express API separates concerns into routes, controllers, middleware, and models.
      
      ## Middleware is Everything
      Express is a middleware pipeline. Every request flows through middleware functions in order:
      \`\`\`js
      app.use(express.json());        // Parse JSON bodies
      app.use(cors());                // Handle CORS
      app.use('/api', routes);        // Mount routes
      app.use(errorHandler);          // Global error handler
      \`\`\`
      
      ## Error Handling
      Create a centralized error handler. All async route errors should be passed to next(err):
      \`\`\`js
      app.use((err, req, res, next) => {
        res.status(err.status || 500).json({ message: err.message });
      });
      \`\`\`
      
      ## Response Format Consistency
      Always return consistent JSON shapes: { success, message, data }.
      
      This predictability makes your API a pleasure to consume from any client.
    `,
  },
  {
    id: 3,
    title: "MongoDB Schema Design Patterns",
    author: "Priya Nair",
    date: "2024-02-05",
    category: "MongoDB",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop",
    shortDescription:
      "Designing MongoDB schemas is an art. Explore embedding vs referencing, indexing strategies, and patterns that scale.",
    fullContent: `
      MongoDB is schema-flexible, but that doesn't mean you should ignore schema design.
      
      ## Embed vs Reference
      
      **Embed** when:
      - Data is always accessed together
      - Child data has no independent existence
      - Data doesn't grow unboundedly
      
      **Reference** when:
      - Data is large and grows unboundedly
      - Data is shared between multiple documents
      - You need to query child data independently
      
      ## The $lookup Aggregation
      For referenced data, use $lookup (MongoDB's version of JOIN):
      \`\`\`js
      db.orders.aggregate([
        { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } }
      ])
      \`\`\`
      
      ## Indexing Strategy
      - Index fields you query on frequently
      - Compound indexes for multi-field queries
      - Use .explain() to analyze query performance
      
      Good schema design means your application stays fast even as data grows.
    `,
  },
  {
    id: 4,
    title: "React Context API vs Redux Toolkit",
    author: "James Park",
    date: "2024-02-18",
    category: "React",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop",
    shortDescription:
      "When to use Context API and when to reach for Redux Toolkit? This guide helps you make the right choice for your application.",
    fullContent: `
      State management is one of the most debated topics in React. Here's a clear framework for deciding.
      
      ## Context API
      Best for:
      - Auth state, theme, language preferences
      - Small-to-medium apps
      - State that doesn't change frequently
      - When you want zero extra dependencies
      
      ## Redux Toolkit
      Best for:
      - Complex state with many interactions
      - Large teams needing DevTools time-travel debugging
      - State that needs normalization
      - When caching and optimistic updates matter
      
      ## The Real Answer
      For most apps, **Context API is enough**. Redux adds complexity that most apps don't need.
      
      \`\`\`js
      // Context is often all you need
      const AuthContext = createContext();
      
      export function AuthProvider({ children }) {
        const [user, setUser] = useState(null);
        return (
          <AuthContext.Provider value={{ user, setUser }}>
            {children}
          </AuthContext.Provider>
        );
      }
      \`\`\`
      
      Start with Context. Migrate to Redux only when you feel genuine pain.
    `,
  },
  {
    id: 5,
    title: "JWT Authentication Deep Dive",
    author: "Elena Sokolov",
    date: "2024-03-01",
    category: "Security",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop",
    shortDescription:
      "JWT tokens power most modern auth systems. Understand the structure, security implications, and best practices for production.",
    fullContent: `
      JSON Web Tokens (JWT) are the backbone of stateless authentication. Let's understand them properly.
      
      ## JWT Structure
      A JWT has 3 base64-encoded parts separated by dots:
      \`header.payload.signature\`
      
      - **Header**: algorithm (HS256, RS256)
      - **Payload**: claims (user id, role, expiry)
      - **Signature**: cryptographic proof of authenticity
      
      ## Access Token + Refresh Token Pattern
      - **Access token**: Short-lived (15min). Sent in Authorization header.
      - **Refresh token**: Long-lived (7 days). Stored in httpOnly cookie.
      
      ## Security: Where to Store Tokens?
      | Location | XSS Safe | CSRF Risk |
      |----------|----------|-----------|
      | localStorage | ❌ | ✅ |
      | Memory (JS var) | ✅ | ✅ |
      | httpOnly Cookie | ✅ | ⚠️ Mitigable |
      
      **Best practice**: Access token in memory, Refresh token in httpOnly cookie.
      
      ## Token Revocation
      JWTs are stateless, so you can't "invalidate" them. Solutions:
      1. Short expiry + refresh tokens
      2. Store refresh token in DB (revoke by deleting)
      3. Token blacklist (Redis)
      
      For most apps, short-lived access tokens + revocable refresh tokens is the sweet spot.
    `,
  },
  {
    id: 6,
    title: "CSS Grid: The Complete Layout System",
    author: "Aisha Kamara",
    date: "2024-03-12",
    category: "CSS",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop",
    shortDescription:
      "CSS Grid revolutionized web layouts. From basic grids to complex magazine layouts, master the most powerful layout tool in CSS.",
    fullContent: `
      CSS Grid is the most powerful layout system ever added to CSS. Here's how to truly master it.
      
      ## Grid vs Flexbox
      - **Flexbox**: One-dimensional (row OR column)
      - **Grid**: Two-dimensional (rows AND columns simultaneously)
      
      Use Flexbox for component-level layout. Use Grid for page-level layout.
      
      ## Core Concepts
      \`\`\`css
      .container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);  /* 3 equal columns */
        grid-template-rows: auto;
        gap: 1.5rem;
      }
      \`\`\`
      
      ## Named Grid Areas
      \`\`\`css
      .layout {
        display: grid;
        grid-template-areas:
          "header header"
          "sidebar main"
          "footer footer";
        grid-template-columns: 250px 1fr;
      }
      \`\`\`
      
      ## Responsive Without Media Queries
      \`\`\`css
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      \`\`\`
      This creates as many 300px+ columns as fit — magic responsive layout!
      
      CSS Grid eliminates the need for complex float hacks and makes responsive layouts intuitive.
    `,
  },
];

// ─── GET BLOG PREVIEWS (Public) ───────────────────────────────
// GET /api/blogs
// Returns all blogs but WITHOUT fullContent (anyone can access)
const getBlogPreviews = async (req, res, next) => {
  try {
    const previews = BLOGS.map(({ id, title, author, date, category, image, shortDescription }) => ({
      id, title, author, date, category, image, shortDescription,
    }));

    return sendSuccess(res, 200, "Blog previews fetched.", {
      blogs: previews,
      count: previews.length,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET FULL BLOG (Protected) ────────────────────────────────
// GET /api/blogs/:id
// Only accessible to logged-in users (protect middleware applied in route)
const getBlogById = async (req, res, next) => {
  try {
    const blog = BLOGS.find((b) => b.id === parseInt(req.params.id));

    if (!blog) {
      const { sendError } = require("../utils/responseUtils");
      return sendError(res, 404, "Blog not found.");
    }

    return sendSuccess(res, 200, "Blog fetched.", { blog });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBlogPreviews, getBlogById };
