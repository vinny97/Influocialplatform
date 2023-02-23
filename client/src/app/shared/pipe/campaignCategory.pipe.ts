import { Pipe, PipeTransform } from '@angular/core';
import { CAMPAIGN_CATEGORIES } from 'src/app/@constants';

@Pipe({
  name: 'campaignCategory',
})
export class CampaignCategoryPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value) {
      return CAMPAIGN_CATEGORIES.find((e) => e.id === value).name;
    }
  }
}
