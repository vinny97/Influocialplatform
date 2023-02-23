import { Pipe, PipeTransform } from '@angular/core';
import { genders } from 'src/app/@constants';

@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {

  transform(genderId): string {
    console.log(genderId, 'gender ID')
    if (genderId) {
      return genders.find(e => e.id === genderId).name
    }
  }

}
