import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { pool } from "./db";
import { userRoute } from "./modules/user/user.route";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  //   res.send("Express server is running");
  return res.status(200).json({
    message: "Express Server",
    author: "Saifullah Kabir",
  });
});

app.use("/api/users", userRoute);

export default app;
