export class Address {
    addressId: number;
    userName: string;
    address: string;
    tel: string;
    userId: string;
  
    constructor(
      addressId: number,
      userName: string,
      address: string,
      tel: string,
      userId: string
    ) {
      this.addressId = addressId;
      this.userName = userName;
      this.address = address;
      this.tel = tel;
      this.userId = userId;
    }
  
    static fromJson(json: { [key: string]: any }): Address {
      return new Address(
        json['addressId'],
        json['userName'],
        json['address'],
        json['tel'],
        json['userId']
      );
    }
  
    toJson(): { [key: string]: any } {
      return {
        addressId: this.addressId,
        userName: this.userName,
        address: this.address,
        tel: this.tel,
        userId: this.userId,
      };
    }
  }