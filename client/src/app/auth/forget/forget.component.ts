import { VerifyService } from './../verify.service';
import { Router } from '@angular/router';
import { UserService } from './../../@core/services/user.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ForgetComponent implements OnInit {

  form!: FormGroup;
  isSubmit = false;
  isLoading = false;

  error = 0;
  errorMessage = "E-mail or Password is invalid";
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router,private verifyService:VerifyService) { }
  ngOnInit(): void {
    this.create()
  }
  get f() { return this.form.controls; }
  create() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    this.error = 0;
    this.isSubmit = true;
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.userService.verifyResend({email:this.form.value.email}).subscribe(res=>{
      if(res.status==200){
        this.isLoading=false;
        this.verifyService.set({ type: 2, sentTo: this.f.email.value })
        this.router.navigate(['/auth/verify'])
      }
    },err=>{
      this.isLoading=false;
    })

  }
}
