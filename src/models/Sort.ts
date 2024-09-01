export class Sort {
    sortId: string;
    itemId?: string;
    sortName: string;
    itemName: string;
    purposeArray?: string[];

    constructor(
        sortId: string,
        sortName: string,
        itemName: string,
        itemId?: string,
        purposeArray?: string[]
    ) {
        this.sortId = sortId;
        this.itemId = itemId;
        this.sortName = sortName;
        this.itemName = itemName;
        this.purposeArray = purposeArray;
    }

    static fromJson(json: { [key: string]: any }): Sort {
        return new Sort(
            json['sortId'].toString(),
            json['sortName'],
            json['itemName'],
            json['itemId'],
            json['purposeArray']
        );
    }
}