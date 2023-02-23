import { VerifyService } from './../verify.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/@core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  isSubmit = false;
  isLoading = false;

  error = 0;
  errorMessage = "E-mail or Password is invalid";
  userLoginEmail: Subscription = new Subscription();
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router,private verifyService:VerifyService) { }
  ngOnInit(): void {
    this.create()
  }
  get f() { return this.form.controls; }
  create() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.error = 0;
    this.isSubmit = true;
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;

    this.userLoginEmail = this.userService.attemptAuth(this.form.value).subscribe((res: any) => {

      this.isLoading = false;

      if (res.status === 200) {
        // check here email verification or profile completeion
        if(res.data.user.role!=3){
          this.router.navigate(['/discover']);
        }else{
          // redirect to engage in case of Brand
          this.router.navigate(["/brands"]);
        }
      }
    }, err => {

      if (err.status === 401) { this.error = 1; }
      if (err.code === 401.1) { this.error = 1; this.errorMessage = err.message; }
      if(err.code==403){
        this.verifyService.set({type:3,sentTo: this.f.email.value })
        this.router.navigate(['/auth/verify'])
      }
      this.isLoading = false;

    })
  }
  ngOnDestroy() {
    this.userLoginEmail.unsubscribe();
  }
}
