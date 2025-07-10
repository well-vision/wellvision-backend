import 'dotenv/config'; // Load .env values first

const config = {
  port: process.env.PORT || 4000,
  env: process.env.NODE_ENV || 'development',

  // MongoDB
  mongodbUri: process.env.MONGODB_URI,

  // JWT
  jwtSecret: process.env.JWT_SECRET,

  // SMTP
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  senderEmail: process.env.SENDER_EMAIL,

  // CORS
  corsOrigin: 'http://localhost:3000', // Replace with production origin when deploying

  // Cookie Options
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
};

export default config;
