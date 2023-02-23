import { Pipe, PipeTransform } from '@angular/core';
import { CAMPAIGN_STATUS } from 'src/app/@constants';

@Pipe({
  name: 'campaignStatus'
})
export class CampaignStatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      return CAMPAIGN_STATUS.find(e => e.id === value).name;
    }
  }

}
