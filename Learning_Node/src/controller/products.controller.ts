import type { IncomingMessage, ServerResponse } from "http";
import { readProducts } from "../service/products.service";
import type { IProducts } from "../types/products.types";

export const productsController = (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const url = req.url;
  const method = req.method;

  const urlParts = url?.split("/");
  //   console.log(urlParts);

  const id =
    urlParts && urlParts[1] === "products" ? Number(urlParts[2]) : null;

  //* get all products
  if (url === "/products" && method === "GET") {
    // const products = [
    //   {
    //     id: 1,
    //     name: "Product-1",
    //   },
    // ];

    const products = readProducts();

    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products retrived successfully",
        data: products,
      }),
    );
  } else if (method === "GET" && id !== null) {
    //* get single product
    const products = readProducts();
    const product = products.find((p: IProducts) => p.id === id);

    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product retrived successfully",
        data: product,
      }),
    );
  }
};
