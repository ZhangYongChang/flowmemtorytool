export class CommonResponseData {
  public errorMessage: string;
  public errorCode: number;
  public data: any;

  constructor() {

  }

  public getData(): any {
    if (this.errorCode !== 0) {
      return null;
    } else {
      return this.data;
    }
  }
}
