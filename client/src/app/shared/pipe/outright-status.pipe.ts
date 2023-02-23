import { Pipe, PipeTransform } from '@angular/core';
import { OUTRIGHT_STATUS } from 'src/app/@constants';

@Pipe({
  name: 'outright-status'
})
export class OutrightStatusPipe implements PipeTransform {

  transform(value: number, args?: any): any {
    if (value) {
      return OUTRIGHT_STATUS.find(e => e.id === value).name;
    }
  }

}
