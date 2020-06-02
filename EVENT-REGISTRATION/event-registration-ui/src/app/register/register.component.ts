import { Component, Inject } from '@angular/core';
import { Registration } from '../Model/Registration';
import { RegisterService } from '../Services/register.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../Model/User';
import { LoginService } from '../Services/login.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registration: Registration = new Registration()
  base64textString: any = []
  fileValid: boolean = false
  image: any
  error: string = null
  isSent: boolean = false

  constructor(private registerService: RegisterService, private snackBar: MatSnackBar,
    private domSanitizer: DomSanitizer, public dialog: MatDialog, public router: Router) { }

  register(registerForm) {
    this.snackBar.open("Loading", "", { duration: 20000 })
    this.registerService.register(this.registration).subscribe(
      res => {
        if (res.token != null) {
          this.isSent = true
          this.snackBar.dismiss()
        }
        else
          this.snackBar.open("Something went wrong Please try again...", "Ok", { duration: 5000 })
      }
    )

  }

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];

    if (file.size > 2000000)
      this.error = "Max 2MB file allowed. File size limit exceeded."
    else
      this.error = null

    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.image = myReader.result;

      this.registration.idImage = this.image
      if (file.size > 2000000)
        this.fileValid = false
      else
        this.fileValid = true
    }
    myReader.readAsDataURL(file);
  }

  onSelectChange() {
    if (this.registration.registrationType == "Self") {
      this.registration.noOfTicket = 1
    }
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(LoginDialog, {
      width: '480px',
      height: '360px'
    });
  }
}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'LoginDialog.html',
})
export class LoginDialog {

  user: User = new User()

  constructor(public dialogRef: MatDialogRef<LoginDialog>, private loginService: LoginService,
    private snackBar: MatSnackBar, private router: Router) { }

  login(): void {
    this.snackBar.open("Loading...", "Ok", { duration: 6000 })
    this.loginService.login(this.user).subscribe(
      res => {
        if (res._id) {
          localStorage.setItem('user', btoa(res._id))
          this.snackBar.open("Login Success", "Ok", { duration: 3000 })
          this.router.navigate(['dashboard'])
          this.dialogRef.close()
        }

        if (res.message)
          this.snackBar.open(res.message, "Ok", { duration: 3000 })
      }
    )
  }

}