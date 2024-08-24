// src/models/User.ts
export class User {
  userId: string;
  userName: string;
  account: string;
  password: string;
  power: string;
  regTime: Date;
  email: string;
  sex: string;
  introduce: string;
  txPicture: string;
  code?: string; // 可选字段

  constructor(
    userId: string,
    userName: string,
    account: string,
    password: string,
    power: string,
    regTime: Date,
    email: string,
    sex: string,
    introduce: string,
    txPicture: string,
    code?: string
  ) {
    this.userId = userId;
    this.userName = userName;
    this.account = account;
    this.password = password;
    this.power = power;
    this.regTime = regTime;
    this.email = email;
    this.sex = sex;
    this.introduce = introduce;
    this.txPicture = txPicture;
    this.code = code;
  }
}
