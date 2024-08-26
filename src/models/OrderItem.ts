export class OrderItem {
    orderNum: string; // 订单号
    orderTime: Date; // 下单时间
    itemId: string[]; // 商品id
    itemName: string[]; // 商品名称
    userId: string; // 购买用户id
    userName: string; // 购买用户名
    price: number; // 购买价格
    address: string; // 收货地址
  
    constructor(
      orderNum: string,
      orderTime: Date,
      itemId: string[],
      itemName: string[],
      userId: string,
      userName: string,
      price: number,
      address: string
    ) {
      this.orderNum = orderNum;
      this.orderTime = orderTime;
      this.itemId = itemId;
      this.itemName = itemName;
      this.userId = userId;
      this.userName = userName;
      this.price = price;
      this.address = address;
    }
  
    static fromJson(json: { [key: string]: any }): OrderItem {
      return new OrderItem(
        json['orderNum'],
        new Date(json['orderTime']),
        json['itemId'],
        json['itemName'],
        json['userId'],
        json['userName'],
        parseFloat(json['price']),
        json['address']
      );
    }
  }
  