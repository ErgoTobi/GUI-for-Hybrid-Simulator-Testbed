import { Component, OnInit } from '@angular/core';
const shell = require('shelljs');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  test() {
  shell.pushd('open http://osxdaily.com');

  }
}
