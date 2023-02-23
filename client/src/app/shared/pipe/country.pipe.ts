import { Pipe, PipeTransform } from '@angular/core';
import { countries } from 'src/app/@constants';

@Pipe({
  name: 'country'
})
export class CountryPipe implements PipeTransform {

  transform(countryCode): string {
    if (countryCode) {
      return countries.find(e => e.code === countryCode).name
    }
  }

}
