import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-proposal-submission-view',
  templateUrl: './proposal-submission-view.component.html',
  styleUrls: ['./proposal-submission-view.component.css'],
})
export class ProposalSubmissionViewComponent implements OnInit {
  @ViewChild('content') content: TemplateRef<any>;
  @ViewChild('published') published: TemplateRef<any>;

  @Input() fee: number;
  @Input() motivation: any;
  @Input() contentPost: number;
  @Input() contentCaption: number;

  constructor(private modalService: NgbModal) {}

  ngOnInit() {}

  open() {
    this.modalService.open(this.content, { size: 'lg', centered: true });
  }
  openContentView() {
    this.modalService.open(this.published, { size: 'lg', centered: true });
  }
  close() {
    this.modalService.dismissAll();
  }
}
