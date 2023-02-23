import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CreateCampaignService {
  public campaign = new BehaviorSubject<any>(null);
  constructor() { }
}
