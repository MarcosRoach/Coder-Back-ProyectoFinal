import { cartsModel } from "../mogodb/models/cart.model.js";
import ProductManager from "./ProductManager.js";

//Clase
class CartManager {
  //Metodos;

  //Crear Carrito
  newCart = async () => {
    try {
      //Crear carrito
      const cart = await cartsModel.create({ products: [], quantity: 0 });
      return { success: "Carrito creado con exito" };
    } catch (error) {
      return { error: "No se pudo crear el carrito" + error };
    }
  };

  //Get Cart by id
  getCartById = async (cid) => {
    //Obtener carrito
    try {
      const cart = await cartsModel
        .findById({ _id: cid })
        .populate("products.product");
      return cart;
    } catch (error) {
      return { error: "No Existe el carrito" };
    }
  };

  //Get All Carts
  getAllCarts = async () => {
    //Obtener carritos
    try {
      const carts = await cartsModel.find();
      return carts;
    } catch (error) {
      return { error: "No Existen carritos" };
    }
  };

  //add product to cart
  addProductToCart = async (cid, pid) => {
    //Instancia ProductManager
    const productManager = new ProductManager();
    let cart;
    let product;

    //Obtener carrito
    try {
      cart = await this.getCartById(cid);
    } catch {
      return { error: "No existe el carrito" };
    }

    //Obtener producto
    try {
      product = await productManager.getProductById({ _id: pid });
    } catch {
      return { error: "No existe el producto" };
    }

    //Agregar producto al carrito
    try {
      //Buscar producto en el carrito
      const productInCart = cart.products.find(
        (product) => product.product._id == pid
      );
      console.log(productInCart);
      //Si el producto ya esta en el carrito
      if (productInCart) {
        //Incrementar cantidad
        productInCart.quantity++;
      } else {
        //Si el producto no esta en el carrito
        //Agregar producto al carrito
        cart.products.push({ product: pid, quantity: 1 });
      }
      //Guardar cambios
      await cart.save();

      //Retornar carrito
      return "Producto agregado al carrito";
    } catch {
      return { error: "No se pudo agregar el producto al carrito" };
    }
  };
}

export default CartManager;
