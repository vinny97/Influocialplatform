import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'collabsListButton',
})
export class CollabListButtonPipe implements PipeTransform {
  transform(proposal: any, args?: any): any {
    console.log(args);

    if (args === 6) {
      if (proposal.outrightStatus === 0) {
        return 'Not bid yet';
      } else if (proposal.outrightStatus === 1) {
        return 'Bid Content Fee';
      } else if (proposal.outrightStatus === 2) {
        return 'waiting for Brand response';
      } else if (proposal.outrightStatus === 3) {
        return 'Bid approved';
      } else if (proposal.outrightStatus === 4) {
        return 'Bid declined';
      }
    } else {
      if (proposal.proposalType === 1) {
        if (proposal.status === 1) {
          return 'View Proposal';
        } else if (proposal.status === 2) {
          {
            return 'Rebid';
          }
        } else if (proposal.status === 3) {
          if (proposal.contentStatus == 0) {
            return 'Submit Content';
          } else if (proposal.contentStatus == 1) {
            return 'Awating Brand Response';
          } else if (proposal.contentStatus == 2) {
            return 'Publish';
          }
        } else if (proposal.status === 4) {
          return 'View Proposal';
        } else if (proposal.status === 5) {
          return 'View Published Proposal';
        }
      }
    }
    if (proposal.proposalType === 2) {
      if (proposal.status === 1) {
        return 'View Proposal';
      } else if (proposal.status === 2) {
        {
          return 'Rebid';
        }
      } else if (proposal.status === 3) {
        if (proposal.contentStatus == 0) {
          return 'Awaiting Brand to submit content';
        } else if (proposal.contentStatus == 1) {
          return 'View Content';
        } else if (proposal.contentStatus == 2) {
          return 'Publish';
        }
      } else if (proposal.status === 4) {
        return 'View Proposal';
      } else if (proposal.status === 5) {
        return 'View Published Proposal';
      }
    }
  }
}
