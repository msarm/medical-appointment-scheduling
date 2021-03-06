import { Component, OnInit }  from '@angular/core';
import { ViewChild }          from '@angular/core';
import { Router }             from '@angular/router';
import { AppState }           from '../app.service';

import { Appointment }        from '../api/model/appointment';
import { AppointmentService } from '../api/api/appointment.service';

import * as moment            from 'moment';

@Component({
  template: require('./appointment-today.html'),
  styles: [ require('./appointment-today.style.scss') ]
})

export class AppointmentTodayComponent implements OnInit {

  private appointments: Appointment[];
  private locale: any;
  private defaultView: string;

  constructor(
    private _state: AppState,
    private router: Router,
    private appointmentService: AppointmentService) {}

  ngOnInit() {
    this._state.isSubPage.next(false);
    this._state.title.next('Today');
    this.getTodaysAppointments();
    this.locale = 'de';
    this.defaultView = 'basicDay';
  }

  private getTodaysAppointments(): void {
    let start = moment.utc().startOf('day');
    let end = moment.utc().endOf('day');
    this.appointmentService
    .appointmentFind(`{"where": {"start":  {"between": ["${start.format()}", "${end.format()}"]}}}`)
    .subscribe(
      x => this.appointments = x,
      e => console.log(e),
      () => console.log('Get today\'s appointments complete')
    );
  }

  private handleEventClick(event) {
    this.router.navigate(['appointment', event.calEvent.id]);
  }
}
