import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-menu',
  template: `
      <nav class="navbar navbar-inverse">
          <div class="container">
              <div class="navbar-header">
                  <button type="button" class="navbar-toggle collapsed"
                          data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                      <span class="sr-only">Toggle navigation</span>
                      <span class="icon-bar"></span>
                      <span class="icon-bar"></span>
                      <span class="icon-bar"></span>
                  </button>
                  <a class="navbar-brand" href="#">流式分析</a>
              </div>
              <div id="navbar" class="collapse navbar-collapse">
                  <ul class="nav navbar-nav navbar-left">
                      <li><a [routerLink]="['fcs-gate-tabs']">数据分析</a></li>
                      <li><a [routerLink]="['report-generate']">报表管理</a></li>
                      <li><a [routerLink]="['specimen-input']">标本信息</a></li>
                      <li><a [routerLink]="['upload-specimen-files']">上传数据</a></li>
                  </ul>
                  <ul class="nav navbar-nav navbar-right">
                      <li><a>登录</a></li>
                  </ul>
              </div>
          </div>
      </nav>
  `,
  styles: []
})
export class NavMenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
