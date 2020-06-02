import { Component, OnInit } from '@angular/core';
import { User } from '../Model/User';
import { AuthService } from '../Services/auth.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  user: User = new User()
  confirmPassword: string = null

  constructor(private authService: AuthService, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    this.authService.login(this.user).subscribe(
      res => {
        if (res._id != null) {
          localStorage.setItem('_user', btoa(JSON.stringify(res)))
          this.router.navigate(['/'])
        }
        if (res.message == "PASSWORD_INCORRECT")
          this._snackBar.open("Check Your Password", "OK", {
            duration: 6000,
          })
        if (res.message == "user_doesnt_exist")
          this._snackBar.open("User doesn't exist. Try registering first.", "OK", {
            duration: 6000,
          })
      }
    )
  }

  register() {
    this.authService.register(this.user).subscribe(
      res => {
        if (res._id != null)
          this._snackBar.open("Registration Scuuessful", "OK", {
            duration: 6000,
          })
        if (res.message == "USER_EXISTS") {
          this._snackBar.open("User already exists.", "Ok", {
            duration: 6000
          })
        }
      }
    )
  }

}
