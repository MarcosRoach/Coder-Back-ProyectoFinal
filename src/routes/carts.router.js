//Router Carts
import { Router } from "express";
import CartManager from "../daos/filesystem/CartManager.js";

const router = Router();

//Instancia CartManager
const cartManager = new CartManager();

//Get By id
router.get("/:cid", async (req, res) => {
  //Id
  const cid = req.params.cid;

  res.send(await cartManager.getCartById(cid));
});

//Get All
router.get("/", async (req, res) => {
  //Respuesta
  const carts = await cartManager.getAllCarts();

  if (carts.length === 0) {
    return res.send({ error: "No hay carritos" });
  }

  res.send(carts);
});

//Post
router.post("/", async (req, res) => {
  //Respuesta
  res.send(await cartManager.newCart());
});

//Post Product to Cart
router.post("/:cid/product/:pid", async (req, res) => {
  //Id
  const cid = req.params.cid;
  const pid = req.params.pid;

  //Respuesta
  res.send(await cartManager.addProductToCart(cid, pid));
});
export default router;
