import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'ago'
})
export class AgoPipe implements PipeTransform {
  transform(value: string, args: string[]): any {

    if (!value) return '-';

    return moment(value).fromNow();;

  }

}
