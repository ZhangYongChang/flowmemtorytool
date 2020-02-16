import {Component, OnInit} from '@angular/core';
import {Specimen} from '../models/specimen';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppHttpService} from '../service/app-http.service';
import {UtilService} from '../service/util.service';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-specimen-input',
  template: `
    <form ng-form [formGroup]="validateForm" (ngSubmit)="onCommit()" >
        <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="name">姓名</nz-form-label>
            <nz-form-control [nzSm]="14" [nzXs]="24">
                <input nz-input formControlName="name" id="name" />
            </nz-form-control>
        </nz-form-item>
        <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="age">年龄</nz-form-label>
            <nz-form-control [nzSm]="14" [nzXs]="24">
                <input nz-input formControlName="age" id="age" />
            </nz-form-control>
        </nz-form-item>
        <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="sex">性别</nz-form-label>
            <nz-form-control [nzSm]="14" [nzXs]="24">
                <nz-radio-group formControlName="sex" id="sex">
                    <label nz-radio nzValue="Men">男</label>
                    <label nz-radio nzValue="Women">女</label>
                </nz-radio-group>
            </nz-form-control>
        </nz-form-item>
        <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="specimenNo">标本编号</nz-form-label>
            <nz-form-control [nzSm]="14" [nzXs]="24">
                <input nz-input formControlName="specimenNo" id="specimenNo" />
            </nz-form-control>
        </nz-form-item>
        <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="hospital">医院</nz-form-label>
            <nz-form-control [nzSm]="14" [nzXs]="24">
                <input nz-input formControlName="hospital" id="hospital" />
            </nz-form-control>
        </nz-form-item>
        <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="department">科室</nz-form-label>
            <nz-form-control [nzSm]="14" [nzXs]="24">
                <input nz-input formControlName="department" id="department" />
            </nz-form-control>
        </nz-form-item>
        <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="bedNo">床号</nz-form-label>
            <nz-form-control [nzSm]="14" [nzXs]="24">
                <input nz-input formControlName="bedNo" id="bedNo" />
            </nz-form-control>
        </nz-form-item>
        <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="doctor">医生</nz-form-label>
            <nz-form-control [nzSm]="14" [nzXs]="24">
                <input nz-input formControlName="doctor" id="doctor" />
            </nz-form-control>
        </nz-form-item>
        <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="caseNo">病例号</nz-form-label>
            <nz-form-control [nzSm]="14" [nzXs]="24">
                <input nz-input formControlName="caseNo" id="caseNo" />
            </nz-form-control>
        </nz-form-item>
        <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="specimenType">标本类型</nz-form-label>
            <nz-form-control [nzSm]="14" [nzXs]="24">
                <nz-radio-group formControlName="specimenType" id="specimenType">
                    <label nz-radio nzValue="GUSHUI">骨髓</label>
                    <label nz-radio nzValue="NIAOYE">尿液</label>
                </nz-radio-group>
            </nz-form-control>
        </nz-form-item>
        <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="collectTime">送检时间</nz-form-label>
            <nz-form-control [nzSm]="14" [nzXs]="24">
                <nz-date-picker formControlName="collectTime" id="collectTime"></nz-date-picker>
            </nz-form-control>
        </nz-form-item>
        <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="recvTime">接收时间</nz-form-label>
            <nz-form-control [nzSm]="14" [nzXs]="24">
                <nz-date-picker formControlName="recvTime" id="recvTime"></nz-date-picker>
            </nz-form-control>
        </nz-form-item>
        <nz-form-item nz-row class="commit-area">
            <nz-form-control [nzSpan]="14" [nzOffset]="6">
                <button nz-button nzType="primary">提交</button>
            </nz-form-control>
        </nz-form-item>
    </form>`,
  styles: [`
      [nz-form] {
          max-width: 600px;
      }
      .commit-are {
          margin-bottom: 8px;
      }
  `]
})
export class SpecimenInputComponent implements OnInit {
  private specimen: Specimen;
  private validateForm: FormGroup;

  constructor(private fb: FormBuilder, private dataService: AppHttpService, private msg: NzMessageService) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      age: [null, [Validators.required]],
      sex: ['Men'],
      specimenNo: [null, [Validators.required]],
      hospital: [null, [Validators.required]],
      department: [null, [Validators.required]],
      bedNo: [null, [Validators.required]],
      doctor: [null, [Validators.required]],
      caseNo: [null, [Validators.required]],
      specimenType: ['GUSHUI'],
      collectTime: [new Date(Date.now())],
      recvTime: [new Date(Date.now())]
    });
  }

  public getFormObj(): Specimen {
    const rawValue = this.validateForm.getRawValue();
    const specimen = new Specimen(new UtilService());
    specimen.name = rawValue.name;
    specimen.age = rawValue.age;
    specimen.sex = rawValue.sex;
    specimen.specimenNo = rawValue.specimenNo;
    specimen.hospital = rawValue.hospital;
    specimen.department = rawValue.department;
    specimen.bedNo = rawValue.bedNo;
    specimen.doctor = rawValue.doctor;
    specimen.caseNo = rawValue.caseNo;
    specimen.specimenType = rawValue.specimenType;
    specimen.collectTime = rawValue.collectTime;
    specimen.recvTime = rawValue.recvTime;
    return specimen;
  }


  public onCommit() {
    let bVaild = true;
    for (const i of Object.keys(this.validateForm.controls)) {
      if (!bVaild) {
        continue;
      } else {
        this.validateForm.controls[i].markAsDirty();
        if (!this.validateForm.controls[i].valid) {
          bVaild =  false;
        }
      }
    }
    this.msg.info('信息存在错误');
    if (bVaild) {
      this.dataService.writeSpecimenDetail(this.getFormObj()).subscribe(
        (data) => {
          if (data === null) {
            this.msg.info('保存信息失败');
          } else {
            this.msg.info('保存信息成功');
            this.validateForm.reset();
          }
        },
        (data) => {
          this.msg.error('保存信息失败');
        }
      );
    }
  }

}
