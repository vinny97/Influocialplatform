import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VerifyService {
  private valueSubject = new BehaviorSubject<any>(null);
  public currentValue = this.valueSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor() {
    let v = window.localStorage['influencialVerify'];
    v && this.valueSubject.next(JSON.parse(v));
  }

  set(value: any) {
    console.log('In Verify Service:', value);
    window.localStorage['influencialVerify'] = JSON.stringify(value);
    this.valueSubject.next(value);
  }

  purge() {
    this.valueSubject.next(null);
    window.localStorage.removeItem('influencialVerify');
  }
  ngOnDestroy() {
    console.log('Inside ngOnDestroy');
    this.valueSubject.next(null);
  }
}
