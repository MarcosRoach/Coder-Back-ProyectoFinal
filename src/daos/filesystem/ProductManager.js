import { productsModel } from "../mogodb/models/products.model.js";

//Clase
class ProductManager {
  //Metodos

  //Get Products de bd
  getProducts = async (
    filtro = null,
    filtroVal = null,
    limite = 10,
    orden = 0,
    pagina = 1
  ) => {
    let whereOptions = {};
    let l;
    console.log("Pagina: " + pagina);
    let p = parseInt(pagina);

    // Controlar que el filtro sea valido
    if (filtro !== "" || filtroVal !== "") {
      whereOptions = { [filtro]: filtroVal };
    }
    //Controlar limite
    l = limite < 1 ? 10 : limite;

    //Controlar pagina
    p = pagina < 1 ? 1 : parseInt(pagina);

    console.log(p);
    //Buscar productos en bd con paginate
    try {
      let products = await productsModel.paginate(whereOptions, {
        limit: l,
        page: p,
        sort: { price: orden },
      });
      if (products.length === 0) {
        throw new Error("No existen productos");
      }
      return products;
    } catch (error) {
      return { error: "No Existen productos" };
    }
  };

  //Get Product by id
  getProductById = async (pid) => {
    //Obtener producto
    try {
      const product = await productsModel.findById(pid);
      return product;
    } catch (error) {
      return { error: "No Existe el producto" };
    }
  };

  //Get Product by code
  getProductByCode = async (code) => {
    try {
      const product = await productsModel.findOne({ code: code });
      return product;
    } catch (error) {
      return { error: "No Existe el producto" };
    }
  };

  //Add Product
  addProduct = async (product) => {
    //pasa a json
    const findProduct = JSON.parse(product);
    //Verificar si existe el producto
    const productExist = await productsModel.findOne({
      code: findProduct.code,
    });

    if (productExist) {
      return { error: "Ya existe el producto" };
    }

    //Agregar producto
    try {
      const newProduct = await productsModel.create(findProduct);
      return { success: "Producto agregado" + JSON.stringify(newProduct) };
    } catch (error) {
      return { error: error };
    }
  };

  //Update Product
  updateProduct = async (pid, product) => {
    console.log(pid);
    //Actualizar producto
    try {
      const updateProduct = await productsModel.updateOne(
        { _id: pid },
        { $set: JSON.parse(product) }
      );
      return { success: "Producto actualizado" };
    } catch (error) {
      return { error };
    }
  };

  //Delete Product
  deleteProduct = async (pid) => {
    //Eliminar producto
    try {
      const deleteProduct = await productsModel.deleteOne({ _id: pid });
      return { success: "Producto eliminado" + deleteProduct };
    } catch (error) {
      return { error };
    }
  };
}

export default ProductManager;
