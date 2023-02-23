import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { countries } from 'src/app/@constants/countries';
import { ManageUserService } from 'src/app/@core';
import { UserType } from 'src/app/@models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  UserType = UserType;
  countries = countries;

  result = null;
  userID = null;
  isLoader: boolean = false;

  constructor(private route: ActivatedRoute, private manageUserService: ManageUserService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userID = params['userID'];
      if (this.userID) {
        this.getData()
      }
    });
  }


  getData() {
    this.isLoader = true;
    this.manageUserService.getUserInfo(this.userID).subscribe((res: any) => {
      this.isLoader = false;
      console.log(res);
      if (res.status === 200) {
        this.result = res.data.user;
      }

    })



  }

}
