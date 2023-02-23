import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcceptProposalComponent } from './accept-proposal/accept-proposal.component';
import { ProposalSubmissionViewComponent } from './proposal-submission-view/proposal-submission-view.component';
import { SharedModule } from '../shared/shared.module';
import { AcceptOutrightComponent } from './accept-outright/accept-outright.component';
import { CreateGroupComponent } from './create-group/create-group.component';



@NgModule({
    declarations: [AcceptProposalComponent, AcceptOutrightComponent, ProposalSubmissionViewComponent,
        CreateGroupComponent],
    imports: [
        CommonModule,
        SharedModule,
    ],

    exports: [AcceptProposalComponent, AcceptOutrightComponent, ProposalSubmissionViewComponent,
        CreateGroupComponent,
    ]
})
export class WidgetModule { }

