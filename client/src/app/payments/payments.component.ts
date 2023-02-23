import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../@core/services/transaction.service';
import { TRANSACTION_STATUS } from '../@constants/transaction';
@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent implements OnInit {
  results: any;
  page = 1;
  limit = 6;
  status = '';
  isLoader: boolean = false;
  result = null;
  transactionStatus = TRANSACTION_STATUS;
  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.getAll();
    this.result.price = this.result.price + (0.15*this.result.price);
  }
  //c
  getAll() {
    this.isLoader = true;
    this.transactionService
      .getAll(this.page, this.limit, this.status)
      .subscribe((response) => {
        console.log(response);
        if (response.status === 200) {
          this.isLoader = false;
          this.result = response.data.result;
          console.log(this.result);
        } else {
          this.isLoader = false;
        }
      });
  }

  onClickPage(e) {
    if (e) {
      this.page = e.page;
      this.limit = e.limit;
      this.getAll();
    }
  }
  onStatusFilterChange(e) {
    console.log(e);
    if (e) {
      this.status = e.id;
      this.getAll();
    } else {
      this.status = '';
      this.getAll();
    }
  }
}
