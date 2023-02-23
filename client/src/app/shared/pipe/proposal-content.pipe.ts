import { Pipe, PipeTransform } from '@angular/core';
import { PROPOSAL_CONTENT_STATUS } from 'src/app/@constants/content-status';

@Pipe({
  name: 'proposalContent'
})
export class ProposalContentPipe implements PipeTransform {

  transform(value: number, args?: any): any {
    if (value) {
      return PROPOSAL_CONTENT_STATUS.find(e => e.id === value).name;
    }
  }

}
