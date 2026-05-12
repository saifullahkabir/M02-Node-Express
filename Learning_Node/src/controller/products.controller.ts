import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProducts } from "../service/products.service";
import type { IProducts } from "../types/products.types";
import { parseBody } from "../utility/parseBody";
import { sendResponse } from "../utility/sendResponse";

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
    try {
      const products = readProducts();

      return sendResponse(
        res,
        200,
        true,
        "Products retrived successfully",
        products,
      );
    } catch (error) {
      return sendResponse(res, 500, false, "Something went wrong!", error);
    }
  }
  //* get single product
  else if (method === "GET" && id !== null) {
    try {
      const products = readProducts();
      const product = products.find((p: IProducts) => p.id === id);

      if (!product) {
        return sendResponse(res, 404, false, "Product not found!", null);
      }

      return sendResponse(
        res,
        200,
        true,
        "Product retrived successfully",
        product,
      );
    } catch (error) {
      return sendResponse(res, 500, false, "Something went wrong!", error);
    }
  }
  //* create a product using post method
  else if (method === "POST" && url === "/products") {
    try {
      const body = await parseBody<IProducts>(req);
      const { id, ...rest } = body; //* id ke body teke alada korci(jdi id de).

      const newProduct = {
        id: Date.now(),
        ...rest,
      };

      const products = readProducts();

      products.push(newProduct);

      insertProduct(products);

      return sendResponse(
        res,
        200,
        true,
        "Product created successfully",
        newProduct,
      );
    } catch (error) {
      return sendResponse(res, 500, false, "Something went wrong!", error);
    }
  }

  //* update product using put
  else if (method === "PUT" && id !== null) {
    try {
      const body = await parseBody<IProducts>(req);
      const products = readProducts();

      const index = products.findIndex((p: IProducts) => p.id === id);

      if (index < 0) {
        sendResponse(res, 404, false, "Product not found!", null);
        return;
      }

      const { id: bodyId, ...rest } = body;

      products[index] = { ...products[index], ...rest };
      // console.log(products[index]);

      insertProduct(products);

      return sendResponse(
        res,
        200,
        true,
        "Product updated successfully",
        products[index],
      );
    } catch (error) {
      return sendResponse(res, 500, false, "Something went wrong!", error);
    }
  }
  //* delete product using delete method
  if (method === "DELETE" && id !== null) {
    try {
      const products = readProducts();
      const index = products.findIndex((p: IProducts) => p.id === id);

      if (index < 0) {
        sendResponse(res, 404, false, "Product not found!", null);
        return;
      }

      //* splice product (index)
      products.splice(index, 1);
      insertProduct(products);

      return sendResponse(res, 200, true, "Product deleted successfully", null);
    } catch (error) {
      return sendResponse(res, 500, false, "Something went wrong!", error);
    }
  }
};
