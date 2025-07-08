// utils/sendToken.js

import jwt from "jsonwebtoken";
import config from "../config/config.js";

/*
|--------------------------------------------------------------------------
| sendToken Utility
|--------------------------------------------------------------------------
| Generates a JWT token and sends it in an HTTP-only cookie.
| Can be reused across login, register, or token refresh endpoints.
*/

const sendToken = (user, res) => {
  const token = jwt.sign(
    { id: user._id },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  res.cookie("token", token, config.cookieOptions);

  return token;
};

export default sendToken;
