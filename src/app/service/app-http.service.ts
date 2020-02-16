import { Injectable } from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {Specimen} from '../models/specimen';
import {HttpClient, HttpRequest, HttpResponse} from '@angular/common/http';
import {CommonResponseData} from '../models/common-response-data';
import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppHttpService {
  private static createSpecimenUrl = '/api/create_specimen';
  private static querySpecimenIdByNoUrl = '/api/query_specimenid';
  private static querySpecimenFileNamesUrl = '/api/query_specimen_fcsfiles';
  private static writeSpecimenGateUrl = '/api/create_flowmetorygate';
  private static querySpecimenGateUrl = '/api/query_flowmetorygate';
  private static querySpecimenSamplePointUrl = '/api/query_specimen_fcsfile_data';
  private static querySpecimenSamplePointByGateUrl = '/api/query_cell_in_polygon';
  private static generateSpecimenReportUrl = '/api/create_flowmetoryreport';
  private static queryNewlyReportUrl = '/api/query_flowmetoryreport';
  private static querySpecimenUrl = '/api/query_specimen_suggest';
  private static dataFieldName = 'data';
  private static msgFieldName = 'msg';
  private static errorNumFieldName = 'error_num';

  constructor(private http: HttpClient,
              private message: NzMessageService) {
  }

  public querySpecimen(param: any): Observable<any> {
    return this.postHttpRequest(AppHttpService.querySpecimenUrl, param);
  }

  public generateSpecimenReport(param: any): Observable<any> {
    return this.postHttpRequest(AppHttpService.generateSpecimenReportUrl, param);
  }

  public queryNewlyReport(param: any): Observable<any> {
    return this.postHttpRequest(AppHttpService.queryNewlyReportUrl, param);
  }

  public querySpecimenGate(param: any): Observable<any> {
    return this.postHttpRequest(AppHttpService.querySpecimenGateUrl, param);
  }

  public querySpecimenSamplePoint(param: any): Observable<any> {
    return this.postHttpRequest(AppHttpService.querySpecimenSamplePointUrl, param);
  }

  public querySpecimenSamplePointByGate(param: any): Observable<any> {
    return this.postHttpRequest(AppHttpService.querySpecimenSamplePointByGateUrl, param);
  }

  public writeSpecimenDetail(specimen: Specimen): Observable<any> {
    return this.postHttpRequest(AppHttpService.createSpecimenUrl, specimen.getFormValue());
  }

  public querySpecimenIdByNo(param: any): Observable<any> {
    return this.postHttpRequest(AppHttpService.querySpecimenIdByNoUrl, param);
  }

  public querySpecimenFileNames(param: any): Observable<any> {
    return this.postHttpRequest(AppHttpService.querySpecimenFileNamesUrl, param);
  }

  public writeSpecimenGate(param: any): Observable<any> {
    return this.postHttpRequest(AppHttpService.writeSpecimenGateUrl, param);
  }

  public uploadSpecimenFile(param: any, file: any): Observable<any> {
    const source = new Observable(observer => {
      const formData = new FormData();
      for (const i of Object.keys(param)) {
        formData.append(i, param[i]);
      }
      formData.append('file', file);
      const req = new HttpRequest('POST', '/api/upload_specimen_fcsfiles', formData, {});
      this.http
        .request(req)
        .pipe(filter(e => e instanceof HttpResponse))
        .subscribe(
          () => {
            observer.next();
          },
          () => {
            observer.error();
          },
          () => {
            observer.complete();
          }
        );
    });
    return source;
  }

  private postHttpRequest(url: string, param: any): Observable<any> {
    const source = new Observable(observer => {
      this.http.post(url, param).subscribe(
        (response) => {
          const result = new CommonResponseData();
          result.data = response[AppHttpService.dataFieldName];
          result.errorCode = response[AppHttpService.errorNumFieldName];
          result.errorMessage = response[AppHttpService.msgFieldName];
          if (result.errorCode !== 0) {
            console.error('message:', result.errorMessage);
            console.error('code:', result.errorCode);
            console.error('data:', result.data);
            observer.error(null);
          } else {
            observer.next(result.data);
          }
        },
        response => {
          observer.error(response);
        },
        () => {
          observer.complete();
        }
      );
    });
    return source;
  }
}
