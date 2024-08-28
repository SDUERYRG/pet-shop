// src/models/ShoppingCart.ts

export class ShoppingCart {
  cartId: string;
  itemId: string;
  userId: string;
  itemName: string;
  userName: string;
  quantity: number;
  price: number;

  constructor(
    cartId: string,
    itemId: string,
    userId: string,
    itemName: string,
    userName: string,
    quantity: number,
    price: number,
  ) {
    this.cartId = cartId;
    this.itemId = itemId;
    this.userId = userId;
    this.itemName = itemName;
    this.userName = userName;
    this.quantity = quantity;
    this.price = price;
  }

  static fromJson(json: { [key: string]: any }): ShoppingCart {
    return new ShoppingCart(
      json['cartId'],
      json['itemId'],
      json['userId'],
      json['itemName'],
      json['userName'],
      json['quantity'],
      parseFloat(json['price']),
    );
  }
}