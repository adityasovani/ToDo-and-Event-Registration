import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegisterService } from '../Services/register.service';
import { Registration } from '../Model/Registration';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  id: string = null
  registration: Registration = new Registration()
  isConfirmed: boolean = false
  isError: boolean = false

  @ViewChild('icard') icard: ElementRef
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;

  constructor(private activatedRoute: ActivatedRoute, private registerService: RegisterService) { }

  ngOnInit(): void {
    this.registerService.confirm(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(res => {
      this.registration = res
      console.log(this.registration);
      this.isConfirmed = true
    })
  }

  download() {
    html2canvas(this.icard.nativeElement).then(canvas => {

      this.icard.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'I-card.png';
      this.downloadLink.nativeElement.click();
    });
  }
}
