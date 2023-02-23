import { Pipe, PipeTransform } from '@angular/core';
import { SOCIAL_MEDIA_CHANNELS } from 'src/app/@constants';

@Pipe({
  name: 'smLogo'
})
export class SmLogoPipe implements PipeTransform {

  transform(value: number, args?: any): any {
    if (value) {
      return SOCIAL_MEDIA_CHANNELS.find(e => e.id === value).logoUrl;
    }
  }

}
