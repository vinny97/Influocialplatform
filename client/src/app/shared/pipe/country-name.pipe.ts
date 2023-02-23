import { Pipe, PipeTransform } from '@angular/core';
import { CAMPAIGN_STATUS, COUNTRIES } from 'src/app/@constants';

@Pipe({
    name: 'countryName'
})
export class CountryNamePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (value) {
            return COUNTRIES.find(e => e.code === value).name;
        }
    }

}
