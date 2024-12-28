import express from "express";

export const app = express();

// Middleware
app.use(express.static('public'));
