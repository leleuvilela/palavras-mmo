import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Palavras MMO Server is running",
    timestamp: new Date().toISOString(),
  });
});

export { router as healthRouter };

