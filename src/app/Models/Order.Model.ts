import { Product } from "./Product.Model";

export class Order {
    id: number;
    dateCreated: string; // Le format "dd/MM/yyyy" peut être stocké en tant que chaîne de caractères
    status: string;
    orderProducts: OrderProduct[]; // La liste des produits dans la commande
    totalOrderPrice?: number; // Calculé côté backend ou frontend
    numberOfProducts?: number; // Calculé côté frontend (optionnel)
  
    constructor(id: number, dateCreated: string, status: string, orderProducts: OrderProduct[]) {
      this.id = id;
      this.dateCreated = dateCreated;
      this.status = status;
      this.orderProducts = orderProducts;
    }
  }
  
  export class OrderProduct {
    product!: Product;
    quantity: number;
    price: number;
  
    constructor(productId: Product, quantity: number, price: number) {
      this.product = productId;
      this.quantity = quantity;
      this.price = price;
    }
  
    getTotalPrice(): number {
      return this.quantity * this.price;
    }
  }
  