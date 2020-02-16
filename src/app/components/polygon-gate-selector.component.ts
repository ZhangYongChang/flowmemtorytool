import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {UtilService} from '../service/util.service';

@Component({
  selector: 'app-polygon-gate-selector',
  template: `
      <div style="width:1000px;height:500px;float:left;border:1px solid #00F">
          <div style="width:500px;height:500px;float:left;border:1px solid #00F">
              <div style="width:500px;height:20px">
                  <label nz-checkbox [(ngModel)]="checked" (ngModelChange)="onSelectChanged($event)">选取</label>
                  <label nz-checkbox [(ngModel)]="cordGate['isexport']" (ngModelChange)="onExportedChanged($event)">导出</label>
              </div>
              <div style="width:500px;height:480px" echarts [options]="echartOption"
                   (chartInit)="onChartInit($event)">
              </div>
          </div>
          <nz-table #editRowTable [nzData]="tableGate"
                    [nzFrontPagination]="false" style="width:498px;height:498px;float:left;border:1px solid #00F">
              <thead>
              <tr>
                  <th [nzShowCheckbox]="false"></th>
                  <th>名称</th>
                  <th>颜色</th>
                  <th>操作</th>
              </tr>
              </thead>
              <tbody>
              <tr *ngFor="let data of editRowTable.data" class="editable-row">
                  <td nzShowCheckbox [(nzChecked)]="data.name === cordGate['selectGate']" (nzCheckedChange)="refreshStatus(data.name)"></td>
                  <td style="width:150px;height:15px">
                      <nz-select [(ngModel)]="data.name" nzPlaceHolder="Choose" style="width:150px;height:15px">
                          <nz-option *ngFor="let item of defaultNames" [nzLabel]="item['label']" [nzValue]="item['value']"></nz-option>
                      </nz-select>
                  </td>
                  <td style="width:80px;height:15px">
                      <nz-select [(ngModel)]="data.color" nzPlaceHolder="Choose" style="width:80px;height:15px">
                          <nz-option *ngFor="let item of defaultColors" [nzLabel]="item['label']" [nzValue]="item['value']"></nz-option>
                      </nz-select>
                  </td>
                  <td>
                      <a (click)="onDeleteRow(data.name)">Delete</a>
                  </td>
              </tr>
              </tbody>
          </nz-table>
      </div>`,
  styles: [`
      button {
          margin-bottom: 16px;
      }

      .editable-cell {
          position: relative;
      }

      .editable-cell-value-wrap {
          padding: 5px 12px;
          cursor: pointer;
      }

      .editable-row:hover .editable-cell-value-wrap {
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          padding: 4px 11px;
      }

      nz-select {
          width: 100px;
      }`]
})
export class PolygonGateSelectorComponent implements OnInit {

  @Input() private specimenid: any;
  @Input() private filename: any;
  @Input() private cellpoints: any;
  @Input() private xaxis: any;
  @Input() private yaxis: any;
  @Input() private gate: any;

  @Output() updateGate = new EventEmitter();
  @Output() deleteGate = new EventEmitter();

  // 存储获取数据
  private cordGate: {};
  private checked: boolean;
  private tableGate: any;

  // 存储绘图相关的对象
  public echartOption: any;
  private echartsIntance: any;
  private drawing = false;
  private drawingGate: any;

  // 常量区数据
  private polygon = 'polygon';
  private polygons = 'polygons';
  private name = 'name';
  private color = 'color';
  private series = 'series';
  private echartOptionTemplate = {
    animation: false,
    toolbox: {
      show: false,
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        saveAsImage: {}
      }
    },
    tooltip: {
      show: false,
      trigger: 'item',
      axisPointer: {
        type: 'cross'
      }
    },
    xAxis: {
      id: this.xaxis,
      min: 0,
      max: 300,
      scale: true,
      name: this.xaxis,
      nameLocation: 'end'
    },
    yAxis: {
      id: this.yaxis,
      min: 10,
      max: 100000,
      scale: true,
      name: this.yaxis,
      nameLocation: 'end',
      type: 'log',
      logBase: 10,
      axisLabel: {
        formatter: this.formatter
      }
    },
    series: []
  };
  private defaultNames = [
    { label: '淋巴细胞(R1)', value: 'R1' },
    { label: '前体B淋巴细胞(R2)', value: 'R2' },
    { label: '异常细胞群(R3)', value: 'R3' },
    { label: '有核红区域细胞(R4)', value: 'R4' },
    { label: '未知细胞群(R5)', value: 'R5' }];
  private defaultColors = [
    { label: 'green', value: 'green' },
    { label: 'yellow', value: 'yellow' },
    { label: 'red', value: 'red' },
    { label: 'purple', value: 'purple' },
    { label: 'black', value: 'black' }];

  constructor(private utilService: UtilService) {
    this.drawing = false;
  }

  ngOnInit() {
    if (this.gate === undefined) {
      this.cordGate = this.createGate();
    } else {
      this.checked = true;
      this.transformCorrdGate();
      this.refreshTableGate();
    }
    this.createOption();
  }

  private createOption() {
    const samplePoint = new Float32Array(this.cellpoints.length);
    for (let index = 0; index < this.cellpoints.length; index = index + 2) {
      samplePoint[index] = this.cellpoints[index] / 1000;
      samplePoint[index + 1] = this.cellpoints[index + 1];
    }
    let chartOption = this.setSamplePointOption(this.echartOptionTemplate, samplePoint);
    chartOption =  this.setGateOption(chartOption);
    this.echartOption = chartOption;
  }

  private setSamplePointOption(echartOption, samplePoint) {
    echartOption[this.series].push({
      type: 'scatter',
      symbolSize: 3,
      data: samplePoint,
      large: true
    });
    return echartOption;
  }

  private setGateOption(echartOption) {
    this.cordGate[this.polygons].forEach((elem, index) => {
      echartOption[this.series].push({
        id: elem[this.name],
        type: 'line',
        data: elem[this.polygon]
      });
    });
    return echartOption;
  }

  private onChartInit(ec) {
    this.echartsIntance = ec;
    this.echartsIntance.getZr().on('mousedown',
      (e) => {
        this.onMouseDown(e);
      });
    this.echartsIntance.getZr().on('mousemove',
      (e) => {
        this.onMouseMove(e);
      });
    this.echartsIntance.getZr().on('mouseup',
      (e) => {
        this.onMouseUp(e);
      });
    this.echartsIntance.getZr().on('dblclick',
      (e) => {
        this.onDbClick(e);
      });
  }

  public transformCorrdGate() {
    this.cordGate = JSON.parse(JSON.stringify(this.gate));
    this.cordGate[this.polygons].forEach((elem, polygonIndex) => {
      const polygon = []
      elem[this.polygon].forEach((point, itemIndex) => {
        polygon.push([point[0] / 1000, point[1]]);
      });
      elem[this.polygon] = polygon;
    });
  }

  public onSelectChanged(val) {
    if (val) {
      this.notifyUpdateGate();
    } else {
      this.notifyDeleteGate();
    }
  }

  private notifyUpdateGate() {
    this.updateGate.emit({
      gatetype: 1,
      gate: this.getActualGate()
    });
  }

  private notifyDeleteGate() {
    this.deleteGate.emit({
      gatetype: 1,
      gate: {
        xaxis: this.xaxis,
        yaxis: this.yaxis
      }
    });
  }

  public onExportedChanged(val) {
    this.checked = false;
  }

  public onMouseDown(e) {
    if (!this.drawing) {
      this.drawing = true;
      this.cordGate[this.polygons].push(this.createPolygon());
      this.drawingGate = this.cordGate[this.polygons][this.cordGate[this.polygons].length - 1];
      this.drawGate();
    }
  }

  public onMouseUp(e) {
    this.drawingGate[this.polygon].push(this.pixel2Coord(this.getPosition(e)));
    this.drawGate();
  }

  public onMouseMove(e) {
    if (this.drawing) {
      this.drawingGate[this.polygon].push(this.pixel2Coord(this.getPosition(e)));
      this.drawGate();
      this.drawingGate[this.polygon].length -= 1;
    }
  }

  public onDbClick(e) {
    if (this.drawingGate[this.polygon].length < 4 || !this.drawing) {
      return;
    }
    this.drawing = false;
    this.drawingGate[this.polygon].length -= 1;
    this.drawingGate[this.polygon].push(this.drawingGate[this.polygon][0]);
    this.drawGate();
    this.checked = false;
  }

  private getActualGate() {
    const dbGate = JSON.parse(JSON.stringify(this.cordGate))
    dbGate[this.polygons].forEach((elem, polygonIndex) => {
      const polygon = [];
      elem[this.polygon].forEach((point, pointIndex) => {
        polygon.push([point[0] * 1000, point[1]]);
      })
      elem[this.polygon] = polygon;
    })
    return dbGate;
  }

  private pixel2Coord(point) {
    return this.echartsIntance.convertFromPixel({ seriesIndex: 0 }, point);
  }

  private coord2Pixel(point) {
    return this.echartsIntance.convertToPixel({ seriesIndex: 0 }, point);
  }

  private getPosition(e) {
    const offsetX = 'offsetX';
    const offsetY = 'offsetY';
    return [e[offsetX], e[offsetY]];
  }

  private drawGate() {
    this.cordGate[this.polygons].forEach((elem, index) => {
      this.echartsIntance.setOption({
        series: [{
          id: elem[this.name],
          type: 'line',
          data: elem[this.polygon]
        }]
      });
    });
    this.refreshTableGate();
  }

  private refreshTableGate() {
    this.tableGate = [];
    for (let i = 0, len = this.cordGate[this.polygons].length; i < len; ++i) {
      const polygon = this.cordGate[this.polygons][i]
      this.tableGate.push({
        name: polygon[this.name],
        color: polygon[this.color]
      });
    }
  }

  private getSuggestName() {
    const gateDefaultNames = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R10'];
    for (let i = 0, len = gateDefaultNames.length; i < len; i++) {
      let used = false;
      const gateDefaultName = gateDefaultNames[i];
      this.cordGate[this.polygons].forEach((elem, index) => {
        if (elem[this.name] === gateDefaultName) {
          used = true;
        }
      })
      if (used === false) {
        return gateDefaultName;
      }
    }
  }

  private getSuggestColor() {
    const gateDefaultColors = ['green', 'yellow', 'red', 'purple', 'black', 'blue', 'orange', 'gray', 'dark', 'Turquoise'];
    for (let i = 0, len = gateDefaultColors.length; i < len; i++) {
      let used = false
      const gateDefaultColor = gateDefaultColors[i]
      this.cordGate[this.polygons].forEach((elem, index) => {
        if (elem[this.color] === gateDefaultColor) {
          used = true;
        }
      })
      if (used === false) {
        return gateDefaultColor;
      }
    }
  }

  private createPolygon() {
    return {
      color: this.getSuggestColor(),
      name: this.getSuggestName(), polygon: []
    };
  }

  private createGate() {
    return {
      id: this.utilService.getGateId(),
      isexport: false,
      isfilter: true,
      selectGate: '',
      polygons: [],
      xaxis: 'SSC-A',
      yaxis: 'PerCP-A'
    };
  }

  private formatter(value, index) {
    const text = Math.log10(value).toString();
    return '10^' + text;
  }

  private clearGate() {
    this.echartsIntance.setOption({
      series: [{
        id: 'R1',
        type: 'line',
        data: []
      }, {
        id: 'R2',
        type: 'line',
        data: []
      }, {
        id: 'R3',
        type: 'line',
        data: []
      }, {
        id: 'R4',
        type: 'line',
        data: []
      }, {
        id: 'R5',
        type: 'line',
        data: []
      }, {
        id: 'R6',
        type: 'line',
        data: []
      }, {
        id: 'R7',
        type: 'line',
        data: []
      }, {
        id: 'R8',
        type: 'line',
        data: []
      }, {
        id: 'R9',
        type: 'line',
        data: []
      }, {
        id: 'R10',
        type: 'line',
        data: []
      }
      ]
    });
  }

  public onDeleteRow(event) {
    const deleteGate = event;
    this.tableGate = this.tableGate.filter(
      (item) => {
        return item[this.name] !== deleteGate;
      });
    this.cordGate[this.polygons] = this.cordGate[this.polygons].filter(
      (item) => {
        return item[this.name] !== deleteGate;
      });
    this.clearGate();
    this.drawGate();
    this.checked = false;
  }

  public refreshStatus(event) {
    const selectGate = 'selectGate';
    if (this.cordGate[selectGate] === event) {
      this.cordGate[selectGate] = '';
    } else {
      this.cordGate[selectGate] = event;
    }
    this.checked = false;
  }
}
