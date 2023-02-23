import { Pipe, PipeTransform } from '@angular/core';
import { SOCIAL_MEDIA_CHANNELS } from 'src/app/@constants';

@Pipe({
  name: 'smName'
})
export class SmNamePipe implements PipeTransform {

  transform(value: number, args?: any): any {
    if (value) {
      return SOCIAL_MEDIA_CHANNELS.find(e => e.id === value).name;
    }
  }
}
