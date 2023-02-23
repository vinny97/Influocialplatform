import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from 'src/app/@core/services/transaction.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class ViewComponent implements OnInit {
  transactionID: any;
  result: any;
  isLoader: boolean;
  constructor(
    private route: ActivatedRoute,
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    this.getParams();
  }

  getParams() {
    this.route.params.subscribe((params) => {
      this.transactionID = params['transactionID'];
      console.log(this.transactionID);

      if (this.transactionID) {
        this.getTransaction();
      }
    });
  }

  getTransaction() {
    this.isLoader = true;
    this.transactionService
      .getTransaction(this.transactionID)
      .subscribe((response) => {
        if (response.status === 200) {
          this.isLoader = false;
          this.result = response.data.transaction;
        }
      });
  }
}
