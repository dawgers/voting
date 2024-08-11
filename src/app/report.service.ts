import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import {formatDate} from '@angular/common';
import { moment } from 'ngx-bootstrap/chronos/test/chain';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor() { }

  static toExportFileName(excelFileName: string): string {
    const date = this.getDate();
    //_${new Date().getTime()}
    return `${excelFileName}_report_${date}.xlsx`;
  }

  static getDate(): string {
    
    const formDate = formatDate(new Date(), 'MM/dd/yyyy', 'en');
    let split = formDate.toString().split('/');

    const month =  moment(split[0], 'MM').format('MMM');
    let date = month+' '+split[1]+', '+split[2];


    return date;
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, ReportService.toExportFileName(excelFileName));
  }
}
