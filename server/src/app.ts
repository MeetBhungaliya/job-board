import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes";
import { ApiError } from "./utils/ApiError";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.use("/api", routes);

app.use((req, res, next) => {
  next(new ApiError(404, "Not Found"));
});

app.use(
  (
    err: ApiError,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    const status = err.statusCode || 500;
    res.status(status).json({
      success: false,
      message: err.message || "Internal Server Error",
      details: err.details || null
    });
  }
);

export default app;
