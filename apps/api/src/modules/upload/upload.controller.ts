import { Request, Response } from "express";

export const uploadFile = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ status: "fail", message: "No file uploaded." });
  }
  // Build the URL from the API server's own origin, not FRONTEND_URL (which is the Next.js app).
  const port = process.env.PORT || 3001;
  const API_URL = process.env.API_URL || `http://localhost:${port}`;
  const url = `${API_URL}/uploads/${req.file.filename}`;
  res.json({ status: "success", data: { url } });
};
