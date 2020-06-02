import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../Services/admin.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Registration } from '../Model/Registration';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  users: Array<Registration> = []
  displayedColumns: string[] = ['name', 'email', 'mobile', 'registrationType', 'date', 'actions'];
  registration: Registration = new Registration()
  dataSource: any

  noOfRegistrations: number = null
  noOfpersonalRegistrations: number = null
  noOfcorporateRegistrations: number = null
  noOfgroupRegistrations: number = null


  //Chart variables
  regByDate: any = null
  chartData: any = null
  options = {
    hAxis: {
      title: 'Dates',
    },
    vAxis: {
      title: 'No of Registrations',
      minValue: 0
    },
    pointSize: 3
  };

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public router: Router, private adminService: AdminService, public dialog: MatDialog,
    private snackBar: MatSnackBar) { }


  ngOnInit(): void {
    if (!localStorage.getItem('user'))
      this.router.navigate([''])
    this.adminService.findAll().subscribe(
      res => {
        this.users = res
        //this.dataSource.sort = this.sort;
        this.noOfRegistrations = this.users.length
        this.noOfgroupRegistrations = this.users.filter(user => user.registrationType == 'Group').length
        this.noOfpersonalRegistrations = this.users.filter(user => user.registrationType == 'Self').length
        this.noOfcorporateRegistrations = this.users.filter(user => user.registrationType == 'Corporate').length
        this.dataSource = new MatTableDataSource(res);

        this.chartData = [
          ['Self', this.noOfpersonalRegistrations],
          ['Group', this.noOfgroupRegistrations],
          ['Corporate', this.noOfcorporateRegistrations]
        ]

        const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

        let all = res.map(r => `${new Date(r.date).getDate()}/${months[new Date(r.date).getMonth()]}/${new Date(r.date).getFullYear()}`)
        all.sort()

        let countOccurance = []

        let unique = new Set(res.map(r => `${new Date(r.date).getDate()}/${months[new Date(r.date).getMonth()]}/${new Date(r.date).getFullYear()}`))

        for (let i = 0; i < unique.size; i++) {
          countOccurance.push([Array.from(unique)[i], all.filter(a => a == Array.from(unique)[i]).length])
        }

        this.regByDate = countOccurance
      }
    )
  }

  show(_id: string) {
    this.snackBar.open("Loading", "Ok", { duration: 20000 })
    this.adminService.findOne(_id).subscribe(
      res => {
        this.snackBar.dismiss()
        this.dialog.open(Details, { data: res })
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  logout() {
    localStorage.removeItem('user')
    this.router.navigate([''])
  }
}

@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialog-data-example-dialog.html',
})
export class Details {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Registration) { }
  data1 = JSON.stringify(this.data)
}