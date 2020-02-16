import {Component, OnInit} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadFile } from 'ng-zorro-antd/upload';
import {AppHttpService} from '../service/app-http.service';

@Component({
  selector: 'app-upload-specimen-file-list',
  template: `
    <nz-select nzShowSearch nzServerSearch nzPlaceHolder="Input search specimen"
       [(ngModel)]="specimenid" [nzShowArrow]="false" [nzFilterOption]="nzFilterOption" (nzOnSearch)="search($event)">
       <nz-option *ngFor="let o of listOfOption" [nzLabel]="o.text" [nzValue]="o.value"> </nz-option></nz-select>
    <br />
    <nz-upload #refUpload [(nzFileList)]="fileList" [nzBeforeUpload]="beforeUpload" [nzData]="specimenid">
      <button nz-button><i nz-icon nzType="upload"></i><span>Select File</span></button>
    </nz-upload>
    <button
      nz-button
      [nzType]="'primary'"
      [nzLoading]="uploading"
      (click)="handleUpload()"
      [disabled]="fileList.length == 0"
      style="margin-top: 16px">
      {{ uploading ? 'Uploading' : 'Start Upload' }}
    </button>
  `,
  styles: [`
      nz-select {
          width: 200px;
      }`
  ]
})
export class UploadSpecimenFileListComponent implements OnInit {
  uploading = false;
  specimenid = '';
  fileList: UploadFile[] = [];
  private listOfOption: Array<{ value: number; text: string }> = [];
  private nzFilterOption = () => true;

  constructor(private msg: NzMessageService, private dataService: AppHttpService) {}

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  }

  public search(value: string): void {
    this.dataService.querySpecimenIdByNo({specimenno: value})
      .subscribe(
        (val) => {
          const listOfOption = val.map(item => {
            return {
              value: item.specimenid.toString(),
              text: item.specimenno
            };
          });
          this.listOfOption = listOfOption;
        },
        response => {
          this.msg.error('查询失败');
        });
  }

  private postFile(file) {
    let status = true;
    this.dataService.uploadSpecimenFile({ specimenid: this.specimenid }, file)
      .subscribe(
        () => {
          // uploading
        },
        () => {
          status = false;
          this.msg.error('上传失败');
        },
        () => {
          if (status) {
            this.msg.success('上传成功');
          }
        });
  }

  private handleUpload(): void {
    this.fileList.forEach((file: any) => {
      this.postFile(file);
    });
  }

  ngOnInit(): void {
    this.search('');
  }
}
