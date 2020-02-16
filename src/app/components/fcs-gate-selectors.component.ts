import {Component, OnInit, Input, Output, OnChanges, EventEmitter} from '@angular/core';
import {AppHttpService} from '../service/app-http.service';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-fcs-gate-selectors',
  template: `
      <div>
          <div *ngFor="let key of getObjectKeys(polygoncellpotins)">
              <app-polygon-gate-selector
                      [specimenid]="specimenid"
                      [filename]="filename"
                      [xaxis]="polygoncellpotins[key]['xaxis']"
                      [yaxis]="polygoncellpotins[key]['yaxis']"
                      [cellpoints]="polygoncellpotins[key]['data']"
                      [gate]="polygonGates[key]"
                      (updateGate)="onUpdateGate($event)"
                      (deleteGate)="onDeleteGate($event)"></app-polygon-gate-selector>
          </div>
          <div *ngFor="let key of getObjectKeys(filtercellpotins)">
              <app-filter-gate-selector
                      [specimenid]="specimenid"
                      [filename]="filename"
                      [xaxis]="filtercellpotins[key]['xaxis']"
                      [yaxis]="filtercellpotins[key]['yaxis']"
                      [cellpoints]="filtercellpotins[key]['data']"
                      [gate]="polygonGates[key]"
                      (updateGate)="onUpdateGate($event)"
                      (deleteGate)="onDeleteGate($event)"></app-filter-gate-selector>
          </div>
          <div *ngFor="let key of getObjectKeys(crosscellpoints)">
              <app-cross-gate-selector
                      [specimenid]="specimenid"
                      [filename]="filename"
                      [xaxis]="crosscellpoints[key]['xaxis']"
                      [yaxis]="crosscellpoints[key]['yaxis']"
                      [cellpoints]="crosscellpoints[key]['data']"
                      [gate]="crossGates[key]"
                      (updateGate)="onUpdateGate($event)"
                      (deleteGate)="onDeleteGate($event)"></app-cross-gate-selector>
          </div>
      </div>`,
  styles: []
})
export class FcsGateSelectorsComponent implements OnInit, OnChanges {

  @Input() private specimenid: any;
  @Input() private filename: any;

  @Output() updateGate = new EventEmitter();
  @Output() deleteGate = new EventEmitter();

  private crosscellpoints: any;
  private polygoncellpotins: any;
  private filtercellpotins: any;
  private crossGates: any;
  private polygonGates: any;
  private crossAxisGroup = [
    ['FITC-A', 'PE-A'],
    ['FITC-A', 'PE-Cy7-A'],
    ['APC-A', 'APC-Cy7-A'],
    ['FITC-A', 'APC-A'],
    ['PE-Cy7-A', 'APC-Cy7-A'],
    ['PE-A', 'PE-Cy7-A']];

  constructor(private dataService: AppHttpService, private msg: NzMessageService) {
    this.crosscellpoints = {};
    this.polygoncellpotins = {};
    this.filtercellpotins = {};
    this.crossGates = {};
    this.polygonGates = {};
  }

  ngOnInit() {
    this.queryFcsFileGate();
  }

  private refreshPolygonSamplePoints(samplePoints: any) {
    const polygonAxisGroup = [['SSC-A', 'PerCP-A']];
    this.polygoncellpotins = this.getSamplePointsMapByAxis(polygonAxisGroup, samplePoints);
    const filterAxisGroup = [['FSC-A', 'SSC-A']];
    this.filtercellpotins = this.getSamplePointsMapByAxis(filterAxisGroup, samplePoints);
  }

  private pickUpCrossGate(gateData) {
    const crossGateName = 'crossgate';
    if (gateData === undefined || !gateData.hasOwnProperty(crossGateName)) { return {}; }
    const crossGateMap = {};
    const crossGate = JSON.parse(gateData[crossGateName]);
    crossGate.forEach(item => {
      const pointName = 'point';
      crossGateMap[this.getKeyByGateItem(item)] = item;
    });
    return crossGateMap;
  }

  private pickUpPolygonGate(gateData) {
    const polygonGateName = 'polygongate';
    if (gateData === undefined || !gateData.hasOwnProperty(polygonGateName)) { return {}; }
    const polygonGateMap = {};
    const polygonGate = JSON.parse(gateData[polygonGateName]);
    polygonGate.forEach(item => {
      polygonGateMap[this.getKeyByGateItem(item)] = item;
    });
    return polygonGateMap;
  }

  private refreshGate(gateData) {
    this.crossGates = this.pickUpCrossGate(gateData);
    this.polygonGates = this.pickUpPolygonGate(gateData);
    this.updateGate.emit({
      filename: this.filename,
      data: this.getAllGate()
    });
    this.queryFcsFileByGate();
  }

  private getKeyByGateItem(item) {
    const xAxisName = 'xaxis';
    const yAxisName = 'yaxis';
    return this.getKey(item[xAxisName], item[yAxisName]);
  }

  private getClassifyGateId() {
    const id = 'id';
    for (const key in this.polygonGates) {
      if (this.polygonGates[key].hasOwnProperty('isfilter')) {
        return this.polygonGates[key][id];
      }
    }
    return -1;
  }

  private getClassifyGateName() {
    for (const keyGate of Object.keys(this.polygonGates)) {
      if (this.polygonGates[keyGate].hasOwnProperty('isfilter')
        && this.polygonGates[keyGate].isfilter === true) {
        return this.polygonGates[keyGate].selectGate;
      }
    }
    return '';
  }

  private getAllGate() {
    const allGates = {};
    for (const key of this.getObjectKeys(this.polygonGates)) {
      allGates[key] = this.polygonGates[key];
    }
    for (const key of this.getObjectKeys(this.crossGates)) {
      allGates[key] = this.crossGates[key];
    }
    return allGates;
  }

  public onUpdateGate(event) {
    if (event.gatetype === 0) {
      event.gate.polygongateid = this.getClassifyGateId();
      event.gate.polygonname = this.getClassifyGateName();
      this.crossGates[this.getKey(event.gate.xaxis, event.gate.yaxis)] = event.gate;
    } else {
      this.polygonGates[this.getKey(event.gate.xaxis, event.gate.yaxis)] = event.gate;
    }
    this.updateGate.emit({
      filename: this.filename,
      data: this.getAllGate()
    });
    if (event.gatetype === 1) {
      this.querySamplePointsInSelectGate();
    }
  }

  public onDeleteGate(event) {
    if (event.gatetype === 0) {
      delete this.crossGates[this.getKey(event.gate.xaxis, event.gate.yaxis)];
    } else {
      delete this.polygonGates[this.getKey(event.gate.xaxis, event.gate.yaxis)];
    }
    this.updateGate.emit({
      filename: this.filename,
      data: this.getAllGate()
    });
  }

  private getSelectGate() {
    const polygonGate = this.polygonGates[this.getKey('SSC-A', 'PerCP-A')];
    let result = {};
    polygonGate.polygons.forEach((elem, index) => {
      if (elem.name === polygonGate.selectGate) {
        result = {
          xaxis: polygonGate.xaxis,
          yaxis: polygonGate.yaxis,
          polygon: elem.polygon
        };
      }
    });
    return result;
  }

  public getObjectKeys(item: any) {
    return Object.keys(item);
  }

  private getKey(xaxis: string, yaxis: string) {
    return this.specimenid + '/' + this.filename + '(' + xaxis + ',' + yaxis + ')';
  }

  private refreshCrossGateSamplePoints(samplePoints) {
    this.crosscellpoints = this.getSamplePointsMapByAxis(this.crossAxisGroup, samplePoints);
  }

  private getSamplePointsMapByAxis(axisGroup: any, samplePoints: any) {
    const samplePointsMap = {};
    for (let j = 0, len = axisGroup.length; j < len; j++) {
      const samplePointsKey = this.getKey(axisGroup[j][0], axisGroup[j][1]);
      samplePointsMap[samplePointsKey] = {
        key: samplePointsKey,
        xaxis: axisGroup[j][0],
        yaxis: axisGroup[j][1],
        data: this.getSamplePointsFloat32ArrayByAxisGroup(samplePoints, axisGroup[j][0], axisGroup[j][1])
      };
    }
    return samplePointsMap;
  }

  private getSamplePointsFloat32ArrayByAxisGroup(samplePoints: any, xaxis: string, yaxis: string) {
    const samplePoint = new Float32Array(samplePoints[xaxis].length * 2);
    for (let index = 0; index < samplePoints[xaxis].length; index++) {
      samplePoint[index * 2] = samplePoints[xaxis][index];
      samplePoint[index * 2 + 1] = samplePoints[yaxis][index];
    }
    return samplePoint;
  }

  public queryFcsFileByGate() {
    this.queryPolygonFilterSamplePoints();
    this.querySamplePointsInSelectGate();
  }

  private querySamplePointsInSelectGate() {
    this.dataService.querySpecimenSamplePointByGate({
      specimenid: this.specimenid,
      fcsfilename: this.filename,
      gate: this.getSelectGate()
    })
      .subscribe(
        (val) => {
          this.refreshCrossGateSamplePoints(val);
        },
        response => {
          this.msg.error('根据选定门查询样本实验信息失败');
        });
  }

  private queryPolygonFilterSamplePoints() {
    this.dataService.querySpecimenSamplePoint({ specimenid: this.specimenid, filename: this.filename })
      .subscribe(
        (val) => {
          this.refreshPolygonSamplePoints(val);
        },
        response => {
          this.msg.error('查询样本实验信息失败');
        }
      );
  }

  private queryFcsFileGate() {
    this.dataService.querySpecimenGate({ specimenid: this.specimenid, fcsfilename: this.filename })
      .subscribe(
        (val) => {
          this.refreshGate(val);
        },
        response => {
          this.msg.error('查询门信息失败');
        });
  }

  ngOnChanges(changes): void {
    this.queryFcsFileGate();
  }
}
