import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UtilService} from '../service/util.service';

@Component({
  selector: 'app-filter-gate-selector',
  template: `
      <div style="width:500px;height:500px;float:left;border:1px solid #00F">
          <div style="width:500px;height:20px">
              <label nz-checkbox [(ngModel)]="checked" (ngModelChange)="onSelectChanged($event)">选取</label>
          </div>
          <div style="width:500px;height:480px" echarts [options]="echartOption"
               (chartInit)="onChartInit($event)">
          </div>
      </div>
  `,
  styles: []
})
export class FilterGateSelectorComponent implements OnInit {

  @Input() private specimenid: any;
  @Input() private filename: any;
  @Input() private cellpoints: any;
  @Input() private xaxis: any;
  @Input() private yaxis: any;
  @Input() private gate: any;

  @Output() updateGate = new EventEmitter();
  @Output() deleteGate = new EventEmitter();

  // 存储获取数据
  private cordGate: any;
  private checked: boolean;

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
      min: 0,
      max: 300,
      scale: true,
      name: this.yaxis,
      nameLocation: 'end'
    },
    series: []
  };

  constructor(private utilService: UtilService) {
    this.drawing = false;
  }

  ngOnInit() {
    if (this.gate === undefined) {
      this.cordGate = this.createGate();
    } else {
      this.transformCordGate();
      this.checked = true;
    }
    this.createOption();
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

  private createOption() {
    const samplePoint = new Float32Array(this.cellpoints.length);
    for (let index = 0; index < this.cellpoints.length; index = index + 1) {
      samplePoint[index] = this.cellpoints[index] / 1000;
    }
    let chartOption = this.setSamplePointOption(this.echartOptionTemplate, samplePoint);
    chartOption =  this.setGateOption(chartOption);
    this.echartOption = chartOption;
  }

  public transformCordGate() {
    this.cordGate = JSON.parse(JSON.stringify(this.gate));
    this.cordGate[this.polygons].forEach((elem, polygonIndex) => {
      const polygon = []
      elem[this.polygon].forEach((point, itemIndex) => {
        polygon.push([point[0] / 1000, point[1] / 1000]);
      });
      elem[this.polygon] = polygon;
    });
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

  private createPolygon() {
    return {
      color: this.getSuggestColor(),
      name: this.getSuggestName(), polygon: []
    };
  }

  private createGate() {
    return {
      id: this.utilService.getGateId(),
      isexport: true,
      polygons: [],
      xaxis: 'FSC-A',
      yaxis: 'SSC-A'
    };
  }

  private notifyUpdateGate() {
    this.updateGate.emit({
      gatetype: 2,
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

  public onSelectChanged(val) {
    if (val) {
      this.notifyUpdateGate();
    } else {
      this.notifyDeleteGate();
    }
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
        polygon.push([point[0] * 1000, point[1] * 1000]);
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
      });
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
}
