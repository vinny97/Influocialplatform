import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortNumber'
})
export class ShortNumberPipe implements PipeTransform {

  transform(input: number, args?: any): any {

    if (!input) { return 0; }
    else {
      // hundreds
      if (input <= 999) { return input; }
      // thousands
      else if (input >= 1000 && input <= 999999) { return (input / 1000).toFixed(2) + 'K'; }
      // millions
      else if (input >= 1000000 && input <= 999999999) { return (input / 1000000).toFixed(2) + 'M'; }
      // billions
      else if (input >= 1000000000 && input <= 999999999999) { return (input / 1000000000).toFixed(2) + 'B'; }
      else return input;
    }

  }

}
