import {Component, OnInit, Input, Output, OnChanges, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-cross-gate-selector',
  template: `
      <div style="width:500px;height:500px;float:left;border:1px solid #00F" >
        <div style="width:500px;height:20px">
            <label nz-checkbox [(ngModel)]="isChecked" (ngModelChange)="onSelectChanged($event)">选取</label>
        </div>
        <div style="width:500px;height:480px" echarts [options]="echartOption"
             (chartInit)="onChartInit($event)">
        </div>
      </div>`,
  styles: []
})
export class CrossGateSelectorComponent implements OnInit, OnChanges {

  @Input() private specimenid: any;
  @Input() private filename: any;
  @Input() private cellpoints: any;
  @Input() private xaxis: any;
  @Input() private yaxis: any;
  @Input() private gate: any;

  @Output() updateGate = new EventEmitter();
  @Output() deleteGate = new EventEmitter();

  public echartOption: any;
  private gateLineX: any;
  private gateLineY: any;
  private echartsIntance: any;
  private isChecked = false;
  private gatePixel: any;

  constructor() {
  }

  ngOnInit() {
    this.transformGate();
    this.createOption();
  }

  private onChartInit(ec) {
    this.echartsIntance = ec;
    this.echartsIntance.getZr().on('dblclick',
      (e) => {
        this.onDbClick(e);
      });
  }

  public notifyUpdateGate() {
    this.updateGate.emit(
      {
        gatetype: 0,
        gate: {
          xaxis: this.xaxis,
          yaxis: this.yaxis,
          point: this.getActualGate()
        }
      });
  }

  public notifyDeleteGate() {
    this.drawNullCrossGate();
    this.deleteGate.emit({
      gatetype: 0,
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

  public transformGate() {
    let point = [];
    if (this.gate === undefined || this.gate === null || !this.gate.hasOwnProperty('point')) {
      this.gateLineX = [];
      this.gateLineY = [];
      this.isChecked = false;
    } else {
      point = this.gate.point;
      if (point instanceof Array && point.length > 0) {
        this.isChecked = true;
        this.gateLineX = [
          [10, point[1]],
          [100000, point[1]]
        ];
        this.gateLineY = [
          [point[0], 10],
          [point[0], 100000]
        ];
      }
    }
  }

  private drawCrossGate() {
    this.echartsIntance.setOption({
      series: [{
        id: 'gate_linex',
        data: this.gateLineX
      }, {
        id: 'gate_liney',
        data: this.gateLineY
      }]
    });
  }

  private drawNullCrossGate() {
    this.gateLineX = [];
    this.gateLineY = [];
    this.drawCrossGate();
  }

  private getActualGate() {
    return this.pixel2Coord(this.gatePixel);
  }

  private onDbClick(e) {
    if (this.isChecked) {
      this.notifyDeleteGate();
      this.isChecked = false;
    }
    this.gatePixel = [e.offsetX, e.offsetY];
    const gateCord = this.pixel2Coord(this.gatePixel);
    this.gateLineX = [
      [10, gateCord[1]],
      [100000, gateCord[1]]
    ];
    this.gateLineY = [
      [gateCord[0], 10],
      [gateCord[0], 100000]
    ];
    this.drawCrossGate();
  }


  private pixel2Coord(position) {
    return this.echartsIntance.convertFromPixel({
      seriesIndex: 0
    }, position);
  }

  private coord2Pixel(position) {
    return this.echartsIntance.convertToPixel({
      seriesIndex: 0
    }, position);
  }

  private formatter(value: any, index: any) {
    const text = Math.log10(value).toString();
    return '10^' + text;
  }

  public getKey() {
    return this.specimenid + '/' + this.filename + '(' + this.xaxis + ',' + this.yaxis + ')';
  }

  private createOption() {
    this.echartOption = {
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          saveAsImage: {}
        }
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'cross'
        }
      },
      xAxis: {
        id: this.xaxis,
        min: 10,
        max: 100000,
        scale: true,
        name: this.xaxis,
        nameLocation: 'end',
        type: 'log',
        logBase: 10,
        axisLabel: {
          formatter: this.formatter
        }
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
      animation: false,
      series: [{
        id: 'cells',
        type: 'scatter',
        symbolSize: 3,
        dimensions: ['x', 'y'],
        silent: true,
        data: this.cellpoints,
        large: true
      }, {
        id: 'gate_linex',
        type: 'line',
        data: this.gateLineX
      }, {
        id: 'gate_liney',
        type: 'line',
        data: this.gateLineY
      }]
    };
  }

  ngOnChanges(changes): void {
    this.createOption();
  }
}
