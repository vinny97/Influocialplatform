import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'brandProposalButton',
})
export class BrandProposalButtonPipe implements PipeTransform {
  transform(proposal: any, args?: any): any {
    if (args === 7) {
      if (proposal.outrightStatus === 0) {
        return 'Not bid yet';
      } else if (proposal.outrightStatus === 1) {
        return 'Outright request sent';
      } else if (proposal.outrightStatus === 2) {
        return 'Approve bid';
      } else if (proposal.outrightStatus === 3) {
        return 'Content outright';
      } else if (proposal.outrightStatus === 4) {
        return 'Outright declined';
      }
    } else if (proposal.proposalType == 1) {
      if (proposal.status === 1) {
        return 'View Proposal';
      } else if (proposal.status === 2) {
        return 'View Submission';
      } else if (proposal.status === 3) {
        if (proposal.contentStatus == 0) {
          return 'Awaiting influencer to submit content';
        }
        if (proposal.contentStatus == 1) {
          return 'View Content';
        }
        if (proposal.contentStatus == 2) {
          return 'Awaitng Influencer to post the content';
        }
      } else if (proposal.status === 4) {
        return 'View Proposal';
      } else if (proposal.status === 5) {
        return 'View Published Content';
      } else {
        return 'View Proposal';
      }
    } else if (proposal.proposalType == 2) {
      if (proposal.status === 1) {
        return 'View Proposal';
      } else if (proposal.status === 2) {
        if (proposal.contentStatus == 1) {
          return 'View Content';
        } else {
          return 'Submit Content';
        }
      } else if (proposal.status === 3) {
        if (proposal.contentStatus == 0) {
          return 'Submit Content';
        } else if (proposal.contentStatus == 1) {
          return 'Awaiting Influencer response';
        } else if (proposal.contentStatus == 2) {
          return 'Content Accepted';
        }
      } else if (proposal.status === 4) {
        return 'View Proposal';
      }
    }
  }
}
