import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private apiService: ApiService) {}

  createTransaction(transaction: any): Observable<any> {
    return this.apiService.post(`/create/transaction/`, { transaction });
  }

  getTransaction(transactionID): Observable<any> {
    return this.apiService.post(`/transaction/${transactionID}`);
  }

  getAll(page = 1, limit = 10, status = '', type = -1): Observable<any> {
    return this.apiService.post(
      `/transaction/get/all/?page=${page}&limit=${limit}&status=${status}${
        type != -1 ? '&type=' + type : ''
      }`
    );
  }

  my(page = 1, limit = 10): Observable<any> {
    return this.apiService.post(`/transaction/my/?page=${page}&limit=${limit}`);
  }

  update(transactionID: any, transaction: any): Observable<any> {
    return this.apiService.post(`/transaction/${transactionID}`, {
      transaction,
    });
  }
}
