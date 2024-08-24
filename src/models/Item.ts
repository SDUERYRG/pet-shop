// src/models/Item.ts
export class Item {
    itemId: string;
    itemName: string;
    picture: string;
    stock: number;
    description: string;
    sell: number;
    price: number;
    discount: number;
    score: number;
    // evaluateList?: Evaluate[];
  
    constructor(
      itemId: string,
      itemName: string,
      picture: string,
      stock: number,
      description: string,
      sell: number,
      price: number,
      discount: number,
      score: number,
    //   evaluateList?: Evaluate[]
    ) {
      this.itemId = itemId;
      this.itemName = itemName;
      this.picture = picture;
      this.stock = stock;
      this.description = description;
      this.sell = sell;
      this.price = price;
      this.discount = discount;
      this.score = score;
    //   this.evaluateList = evaluateList;
    }
  }
  

  