import { Pipe, PipeTransform } from '@angular/core';
import { PROPOSAL_STATUS } from 'src/app/@constants';

@Pipe({
  name: 'proposalStatus'
})
export class ProposalStatusPipe implements PipeTransform {

  transform(value: number, args?: any): any {
    if (value) {
      return PROPOSAL_STATUS.find(e => e.id === value).name;
    }
  }

}
