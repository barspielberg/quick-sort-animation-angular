export class ItemModel {
    constructor(
      public value: number,
      public isPivot: boolean=false,
      public isDone: boolean=false,
      public isActive: boolean=false,
      public isCheck: boolean=false,
    ) {}
  }
  