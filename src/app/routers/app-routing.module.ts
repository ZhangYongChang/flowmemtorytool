import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FcsGateTabsComponent} from '../components/fcs-gate-tabs.component';
import {SpecimenInputComponent} from '../components/specimen-input.component';
import {ReportGenerateComponent} from '../components/report-generate.component';
import {UploadSpecimenFileListComponent} from '../components/upload-specimen-file-list.component';


const routes: Routes = [
  {path: '', component: ReportGenerateComponent},
  {path: 'specimen-input', component: SpecimenInputComponent},
  {path: 'report-generate', component: ReportGenerateComponent},
  {path: 'fcs-gate-tabs', component: FcsGateTabsComponent},
  {path: 'upload-specimen-files', component: UploadSpecimenFileListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
