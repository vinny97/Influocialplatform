import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'countryImage'
})
export class CountryImagePipe implements PipeTransform {

  transform(countryCode: String, size = 24): string {
    if (countryCode) {
      return `https://www.countryflags.io/${countryCode}/flat/${size}.png`;
    }
  }
}


