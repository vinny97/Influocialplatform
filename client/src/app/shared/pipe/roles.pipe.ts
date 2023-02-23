import { Pipe, PipeTransform } from '@angular/core';
import { ROLES } from 'src/app/@constants';

@Pipe({
  name: 'RolesPipe',
})
export class RolesPipe implements PipeTransform {
  transform(value: number, args?: any): any {
    if (value) {
      return ROLES.find((e) => e.id === value).name;
    }
  }
}
