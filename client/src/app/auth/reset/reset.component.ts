import { Toast } from './../../@helpers/SwalToast';
import { Subscription } from 'rxjs';
import { VerifyService } from './../verify.service';
import { Router } from '@angular/router';
import { UserService } from './../../@core/services/user.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  userVerifyService: Subscription = new Subscription();

  form!: FormGroup;
  isSubmit = false;
  isLoading = false;

  error = 0;
  type=0;
  sentTo='';
  errorMessage = "Password Don't Match";
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router,private verifyService: VerifyService ) { }
  ngOnInit(): void {
    this.userVerifyService = this.verifyService.currentValue.subscribe(value => {
      if(value) {
        this.type = value.type;
        this.sentTo = value.sentTo;
      } else {
        this.router.navigate(['auth'])
      }

})
    this.create()
  }
  get f() { return this.form.controls; }
  create() {
    this.form = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit() {
    this.error = 0;
    this.isSubmit = true;
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if(this.form.value.password===this.form.value.confirmPassword){
      this.userService.resetPassword({type:this.type,email:this.sentTo,password:this.form.value.password}).subscribe(res=>{
        if(res.status==200){
          this.isLoading=false;
          // this.userService.setAuth(res.data.user);
          this.router.navigate(['/discover']);
        }
      })
    }else{
      this.isLoading=false;
      Toast.fire({ title: "Password Don't Match", icon: "error" })
    }
  }
  ngOnDestroy() {
    this.userVerifyService.unsubscribe();
  }
}
