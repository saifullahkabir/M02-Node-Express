import express, {
  application,
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
import config from "./config";

const app: Application = express();
const port = config.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString: config.connection_string,
});

app.get("/", (req: Request, res: Response) => {
  //   res.send("Express server is running");
  res.status(200).json({
    message: "Express Server",
    author: "Saifullah Kabir",
  });
});

app.post("/", async (req: Request, res: Response) => {
  const { name, email } = req.body;

  res.status(201).json({
    message: "Created Successfully",
    data: {
      name,
      email,
    },
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
