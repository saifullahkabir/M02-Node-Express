import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "./src/database/db.json");

export const readProducts = () => {
//   console.log(process.cwd());
const products = fs.readFileSync(filePath, "utf-8");
// console.log(JSON.parse(products));
return JSON.parse(products);
};
