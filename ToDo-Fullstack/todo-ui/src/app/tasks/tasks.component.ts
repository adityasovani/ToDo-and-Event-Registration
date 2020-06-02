import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NgForm } from '@angular/forms';
import { Task } from '../Model/Task';
import { Router } from '@angular/router';
import { User } from '../Model/User';
import { TasksService } from '../Services/tasks.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {


  task: Task = new Task()
  tasks: Array<Task> = []
  completedTasks: Array<Task> = []
  isLoggedIn: boolean = false
  currentUser: User = null

  //Flags for UI
  cheked: boolean = true

  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(public router: Router, private taskService: TasksService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.currentUser = null
    this.tasks = []
    this.completedTasks = []
    this.cheked = true

    if (localStorage.getItem('_user') != null) {
      this.isLoggedIn = true
      this.currentUser = JSON.parse(atob(localStorage.getItem('_user')))

      //Load tasks
      this.taskService.getTasks(this.currentUser._id).subscribe(
        res => {
          this.tasks = res
        }
      )
      //Load completed tasks
      this.taskService.getCompletedTasks(this.currentUser._id).subscribe(
        res => {
          this.completedTasks = res
        }
      )
    }
    else {
      this.isLoggedIn = false
      if (localStorage.getItem('tasks') != null) {

        this.tasks = JSON.parse(atob(localStorage.getItem('tasks')))
      }
      if (localStorage.getItem('archieved') != null) {

        this.completedTasks = JSON.parse(atob(localStorage.getItem('archieved')))
      }
    }
  }

  close(reason: string) {
    this.sidenav.close();
  }

  completeTask(index: number) {
    this.tasks[index].taskStatus = "Completed"
    this.completedTasks.push(this.tasks[index])

    this.tasks.splice(index, 1)

    localStorage.setItem('archieved', btoa(JSON.stringify(this.completedTasks)))
    localStorage.setItem('tasks', btoa(JSON.stringify(this.tasks)))

    this.ngOnInit()
  }

  completeTaskDB(task: Task) {
    this.taskService.completeTask(this.currentUser._id, task).subscribe(
      res => {
        if (res.message == 'TASK_COMPLETED') {
          this._snackBar.open("Task Completed", "OK", {
            duration: 4000,
          })
          this.ngOnInit()
        }
      }
    )
  }

  incomplete(index: number) {
    this.cheked = true
    this.completedTasks[index].taskStatus = "In Progress"
    this.tasks.push(this.completedTasks[index])

    this.completedTasks.splice(index, 1)

    localStorage.setItem('archieved', btoa(JSON.stringify(this.completedTasks)))
    localStorage.setItem('tasks', btoa(JSON.stringify(this.tasks)))
  }

  incompleteTaskDB(task: Task) {
    this.cheked = true

    this.taskService.incompleteTask(this.currentUser._id, task).subscribe(
      res => {
        if (res.message == 'TASK_INCOMPLETED') {
          this._snackBar.open("Status changed.", "OK", {
            duration: 4000,
          })
          this.ngOnInit()
        }
      }
    )
  }

  addTask(form: NgForm) {
    this.tasks.push(form.value)
    localStorage.setItem('tasks', btoa(JSON.stringify(this.tasks)))
  }

  addTaskDB(form: NgForm) {
    form.value.taskId = Math.floor(Math.random() * 100000)
    form.value.dueDate = form.value.dueDate.toString()
    this.taskService.addTask(form.value, this.currentUser._id).subscribe(
      res => {
        if (res.message == 'TASK_ADDED')
          this._snackBar.open("Task added !!", "OK", {
            duration: 4000,
          })
        this.ngOnInit()
      }
    )
  }

  delete(index: number) {
    this.tasks.splice(index, 1)
    localStorage.setItem('tasks', btoa(JSON.stringify(this.tasks)))
  }

  deleteTaskDB(taskId: number) {
    this.taskService.deleteTask(this.currentUser._id, taskId).subscribe(
      res => {
        if (res.message == 'TASK_REMOVED') {
          this._snackBar.open("Task deleted.", "OK", {
            duration: 4000,
          })
          this.ngOnInit()
        }
      }
    )
  }

  logout() {
    localStorage.removeItem('_user')
    this.ngOnInit()
  }

  viewNew() { this.tasks = JSON.parse(atob(localStorage.getItem('tasks'))).filter(task => task.taskStatus == "New") }

  viewInProgress() { this.tasks = JSON.parse(atob(localStorage.getItem('tasks'))).filter(task => task.taskStatus == "In Progress") }

  viewAll() { this.tasks = JSON.parse(atob(localStorage.getItem('tasks'))) }

  viewPersonal() { this.tasks = JSON.parse(atob(localStorage.getItem('tasks'))).filter(task => task.taskLabel == "Personal") }

  viewWork() { this.tasks = JSON.parse(atob(localStorage.getItem('tasks'))).filter(task => task.taskLabel == "Work") }

  viewShopping() { this.tasks = JSON.parse(atob(localStorage.getItem('tasks'))).filter(task => task.taskLabel == "Shopping") }

  viewOthers() { this.tasks = JSON.parse(atob(localStorage.getItem('tasks'))).filter(task => task.taskLabel == "Others") }

  //For logged in user
  viewNewLoggedIn() {
    this._snackBar.open("Loding...", "OK", {
      duration: 2000,
    })
    this.taskService.getTasks(this.currentUser._id).subscribe(
      res => {
        this.tasks = res.filter(task => task.taskStatus == "New");
      }
    )
  }
  viewInProgressLoggedIn() {
    this._snackBar.open("Loding...", "OK", {
      duration: 2000,
    })
    this.taskService.getTasks(this.currentUser._id).subscribe(
      res => { this.tasks = res.filter(task => task.taskStatus == "In Progress") }
    )
  }
  viewAllLoggedIn() {
    this._snackBar.open("Loding...", "OK", {
      duration: 2000,
    })
    this.taskService.getTasks(this.currentUser._id).subscribe(
      res => { this.tasks = res }
    )
  }

  viewPersonalLoggedIn() {
    this._snackBar.open("Loding...", "OK", {
      duration: 2000,
    })
    this.taskService.getTasks(this.currentUser._id).subscribe(
      res => { this.tasks = res.filter(task => task.taskLabel == "Personal") }
    )
  }
  viewWorkLoggedIn() {
    this._snackBar.open("Loding...", "OK", {
      duration: 2000,
    })
    this.taskService.getTasks(this.currentUser._id).subscribe(
      res => { this.tasks = res.filter(task => task.taskLabel == "Work") }
    )
  }
  viewShoppingLoggedIn() {
    this._snackBar.open("Loding...", "OK", {
      duration: 2000,
    })
    this.taskService.getTasks(this.currentUser._id).subscribe(
      res => { this.tasks = res.filter(task => task.taskLabel == "Shopping") }
    )
  }
  viewOthersLoggedIn() {
    this._snackBar.open("Loding...", "OK", {
      duration: 2000,
    })
    this.taskService.getTasks(this.currentUser._id).subscribe(
      res => { this.tasks = res.filter(task => task.taskLabel == "Others") }
    )
  }
}

