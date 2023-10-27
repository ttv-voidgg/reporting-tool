import express from 'express';
import helmet from 'helmet';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to set Cross-Origin-Opener-Policy header
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable content security policy if needed
    crossOriginOpenerPolicy: {
      policy: 'same-origin',
    },
  })
);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle requests to the root URL ("/")
app.get('/', (req, res) => {
  // Send the 'index.html' file as the response
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
