import { Pipe, PipeTransform } from '@angular/core';
import { TRANSACTION_STATUS } from 'src/app/@constants';

@Pipe({
  name: 'transactionStatus',
})
export class TransactionStatusPipe implements PipeTransform {
  transform(value: number, args?: any): string {
    if (TRANSACTION_STATUS) {
      return TRANSACTION_STATUS.find((e) => e.id === value).name;
    }
  }
}
