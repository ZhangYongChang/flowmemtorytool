import { UtilService } from '../service/util.service';

export class Specimen {
  public name: string;
  public age: number;
  public sex: string;
  public specimenNo: string;
  public hospital: string;
  public department: string;
  public bedNo: string;
  public doctor: string;
  public caseNo: string;
  public specimenType: string;
  public collectTime: Date;
  public recvTime: Date;

  constructor(private util: UtilService) {
    this.name = '';
    this.age = 0;
    this.sex = 'Men';
    this.specimenNo = '';
    this.hospital = '';
    this.department = '';
    this.bedNo = '';
    this.doctor = '';
    this.caseNo = '';
    this.specimenType = 'GUSHUI';
    this.collectTime = new Date(Date.now());
    this.recvTime = new Date(Date.now());
  }

  public getFormValue() {
    return {
      name: this.name,
      age: this.age,
      sex: this.sex,
      specimenno: this.specimenNo,
      hospital: this.hospital,
      department: this.department,
      bedno: this.bedNo,
      doctor: this.doctor,
      caseno: this.caseNo,
      specimentype: this.specimenType,
      collecttime: this.util.timestampToDateTime(this.collectTime, 'yyyy-MM-dd'),
      recvtime: this.util.timestampToDateTime(this.recvTime, 'yyyy-MM-dd')
    };
  }
}
