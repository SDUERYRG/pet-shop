import { OrderItem } from "./OrderItem";

export class Order {
    orderId: string;
    orderNum: string;
    orderTime: Date;
    deliverTime?: Date;
    receiptTime?: Date;
    state: string;
    price: number;
    userId: string;
    orderDetail?: OrderItem;
  
    constructor(
      orderId: string,
      orderNum: string,
      orderTime: Date,
      state: string,
      price: number,
      userId: string,
      deliverTime?: Date,
      receiptTime?: Date,
      orderDetail?: OrderItem
    ) {
      this.orderId = orderId;
      this.orderNum = orderNum;
      this.orderTime = orderTime;
      this.deliverTime = deliverTime;
      this.receiptTime = receiptTime;
      this.state = state;
      this.price = price;
      this.userId = userId;
      this.orderDetail = orderDetail;
    }
  
    static fromJson(json: { [key: string]: any }): Order {
      return new Order(
        json['orderId'],
        json['orderNum'],
        new Date(json['orderTime']),
        json['state'],
        parseFloat(json['price']),
        json['userId'],
        json['deliverTime'] ? new Date(json['deliverTime']) : undefined,
        json['receiptTime'] ? new Date(json['receiptTime']) : undefined
      );
    }
  }
  