import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  private id = 0;

  constructor() { }

  public timestampToDateTime(date: Date, format: string = 'yyyy-MM-dd HH:mm:ss') {
    const year = date.getFullYear().toString();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return format.replace('yyyy', year.toString())
      .replace('MM', month > 9 ? month.toString() : '0' + month.toString())
      .replace('dd', day > 9 ? day.toString() : '0' + day.toString())
      .replace('HH', hour > 9 ? hour.toString() : '0' + hour.toString())
      .replace('mm', minute > 9 ? minute.toString() : '0' + minute.toString())
      .replace('ss', second > 9 ? second.toString() : '0' + second.toString());
  }

  public getGateId() {
    this.id += 1;
    return this.id;
  }
}
