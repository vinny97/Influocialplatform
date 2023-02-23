import { Pipe, PipeTransform } from '@angular/core';
import { POST_TYPES } from 'src/app/@constants';

@Pipe({
  name: 'postType'
})
export class PostTypePipe implements PipeTransform {

  transform(value: number, args?: any): any {
    if (value) {
      return POST_TYPES.find(e => e.id === value).name;
    }
  }

}
