import { Component, OnInit } from '@angular/core';
import {AppHttpService} from '../service/app-http.service';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-report-generate',
  template: `
      <nz-table #reportTable [nzData]="specimenReport" [nzFrontPagination]="true">
          <thead>
          <tr>
              <th>标本编号</th>
              <th>编本ID</th>
              <th>生成</th>
              <th>下载</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let data of reportTable.data">
              <td>{{ data.specimenno }}</td>
              <td>{{ data.specimenid }}</td>
              <td>
                  <a (click)="onGenerateReport(data.specimenid)">生成</a>
              </td>
              <td>
                  <a (click)="onQueryReport(data.specimenid)">下载</a>
              </td>
          </tr>
          </tbody>
      </nz-table>
  `,
  styles: []
})
export class ReportGenerateComponent implements OnInit {

  private specimenReport: any;
  private generateReport: any;

  constructor(private dataService: AppHttpService, private msg: NzMessageService) { }

  ngOnInit() {
    this.dataService.querySpecimen({}).subscribe(
      (val) => {
        this.specimenReport = val;
      },
      response => {
        this.msg.error('查询标本信息失败');
      });
  }

  private onGenerateReport(specimenid: number) {
    this.dataService.generateSpecimenReport({ specimenid }).subscribe(
      (val) => {
        this.generateReport = val;
        this.msg.success('生成报表成功');
      },
      response => {
        this.msg.error('生成报表失败');
      });
  }

  private onQueryReport(specimenid: number) {
    this.dataService.queryNewlyReport({ specimenid }).subscribe(
      (val) => {
        this.generateReport = val;
        window.open('/static/' + this.generateReport.filename, '_blank');
      },
      response => {
        this.msg.error('查看报表失败');
      });
  }

}
