import {Component, Input, OnInit} from '@angular/core';
import {AppHttpService} from '../service/app-http.service';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-fcs-gate-tabs',
  template: `
      <div>
          <div>
              <nz-select nzShowSearch nzServerSearch nzPlaceHolder="Input search specimen"
                         [(ngModel)]="specimenid" [nzShowArrow]="false"
                         [nzFilterOption]="nzFilterOption"
                         (nzOnSearch)="querySpecimenIdByNo($event)" (ngModelChange)="onModelChanged($event)">
                  <nz-option *ngFor="let o of listOfOption" [nzLabel]="o.text" [nzValue]="o.value"></nz-option>
              </nz-select>
              <button nz-button nzType="default" (click)="onSaveGate()">保存</button>
          </div>
          <nz-tabset [nzTabPosition]="'top'" [nzType]="'card'">
              <nz-tab *ngFor="let fcsFileName of fcsFileNames" [nzTitle]="fcsFileName">
                  <app-fcs-gate-selectors [specimenid]="specimenid" [filename]="fcsFileName"
                                          (updateGate)="onUpdateGate($event)"
                                          (deleteGate)="onDeleteGate($event)">
                  </app-fcs-gate-selectors>
              </nz-tab>
          </nz-tabset>
      </div>`,
  styles: [`
      nz-select {
          width: 200px;
      }`]
})
export class FcsGateTabsComponent implements OnInit {

  @Input() public specimenid: any;
  private fcsFileNames: any;
  private listOfOption: Array<{ value: number; text: string }> = [];
  private inVaildId: number;
  private specimenGate = {};
  private nzFilterOption = () => true;

  constructor(private dataService: AppHttpService, private msg: NzMessageService) {
    this.inVaildId = -1;
    this.specimenid = this.inVaildId;
  }

  ngOnInit() {
    this.querySpecimenIdByNo('');
    this.postFcsFileNames();
  }

  public querySpecimenIdByNo(value: string): void {
    this.dataService.querySpecimenIdByNo({specimenno: value}).subscribe(
      (val) => {
        const listOfOption = val.map(item => {
          return {
            value: item.specimenid,
            text: item.specimenno
          };
        });
        this.listOfOption = listOfOption;
      },
      response => {
        this.msg.error('querySpecimenIdByNo failed', response);
      }
    );
  }

  public postFcsFileNames() {
    if (this.specimenid === this.inVaildId) {
      return;
    }
    this.dataService.querySpecimenFileNames( {specimenid: this.specimenid}).subscribe(
      (val) => {
        this.fcsFileNames = val.fcsfilenames;
      },
      response => {
        this.msg.error('querySpecimenFileNames failed', response);
      }
    );
  }

  public onModelChanged(event) {
    this.postFcsFileNames();
  }

  public onUpdateGate(event) {
    this.specimenGate[event.filename] = event.data;
  }

  public onDeleteGate(event) {
  }

  private saveGate(data) {
    this.dataService.writeSpecimenGate(data).subscribe(
      (val) => {
        this.msg.info('标本门保存成功');
      },
      response => {
        this.msg.error('标本门保存失败:', response);
      }
    );
  }

  public onSaveGate() {
    if (this.specimenGate === undefined || this.specimenGate === null) {
      return;
    }
    for (const filename of Object.keys(this.specimenGate)) {
      const dbGate = {
        specimenid: this.specimenid,
        fcsfilename: filename,
        statinfogate: 0,
        polygongate: [],
        crossgate: []
      };
      for (const gateKey of Object.keys(this.specimenGate[filename])) {
        if (this.specimenGate[filename][gateKey].hasOwnProperty('point')) {
          dbGate.crossgate.push(this.specimenGate[filename][gateKey]);
        }
        if (this.specimenGate[filename][gateKey].hasOwnProperty('polygons')) {
          dbGate.polygongate.push(this.specimenGate[filename][gateKey]);
          if (this.specimenGate[filename][gateKey].isexport) {
            if (this.specimenGate[filename][gateKey].hasOwnProperty('isfilter')) {
              dbGate.statinfogate = this.specimenGate[filename][gateKey].id;
            }
          }
        }
      }
      this.saveGate(dbGate);
    }
  }
}
