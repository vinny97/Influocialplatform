import { Pipe, PipeTransform } from '@angular/core';
import { PRODUCT_PHYSICAL_OPTIONS } from 'src/app/@constants';

@Pipe({
  name: 'physicalOptions'
})
export class PhysicalOptionsPipe implements PipeTransform {

  transform(value: number, args?: any): any {
    return PRODUCT_PHYSICAL_OPTIONS.find(e => e.id === value).name;
  }

}
