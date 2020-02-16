import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './routers/app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';

import { AppComponent } from './app.component';
import { CrossGateSelectorComponent } from './components/cross-gate-selector.component';
import { PolygonGateSelectorComponent } from './components/polygon-gate-selector.component';
import { FcsGateSelectorsComponent } from './components/fcs-gate-selectors.component';
import { FilterGateSelectorComponent } from './components/filter-gate-selector.component';
import { SpecimenInputComponent } from './components/specimen-input.component';
import { FcsGateTabsComponent } from './components/fcs-gate-tabs.component';
import { NavMenuComponent } from './components/nav-menu.component';
import { ReportGenerateComponent } from './components/report-generate.component';
import { UploadSpecimenFileListComponent } from './components/upload-specimen-file-list.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    CrossGateSelectorComponent,
    PolygonGateSelectorComponent,
    FcsGateSelectorsComponent,
    FilterGateSelectorComponent,
    SpecimenInputComponent,
    FcsGateTabsComponent,
    ReportGenerateComponent,
    UploadSpecimenFileListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEchartsModule,
    HttpClientModule,
    NgZorroAntdModule,
    BrowserAnimationsModule,
  ],
  providers: [{
      provide: NZ_I18N, useValue: zh_CN
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
