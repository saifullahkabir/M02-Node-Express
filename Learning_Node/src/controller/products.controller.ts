import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProducts } from "../service/products.service";
import type { IProducts } from "../types/products.types";
import { parseBody } from "../utility/parseBody";

export const productsController = async (
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
  }
  //* get single product
  else if (method === "GET" && id !== null) {
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
  //* create a product
  else if (method === "POST" && url === "/products") {
    const body = await parseBody<IProducts>(req);
    // console.log(body);
    const { id, ...rest } = body; //* id ke body teke alada korci(jdi id de).

    const newProduct = {
      id: Date.now(),
      ...rest,
    };

    const products = readProducts();

    products.push(newProduct);
    // console.log(products);

    insertProduct(products);

    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product created successfully",
        data: newProduct,
      }),
    );
  }
};
