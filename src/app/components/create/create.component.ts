import {Component, OnInit} from '@angular/core';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormArray, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})

export class CreateComponent implements OnInit {

  tabs = ['Scenario 1'];
  scenarioCounter;
  selected = new FormControl(0);

  // Saving the mode
  modes: ModeElement[] = MODES;
  selectedMode: ModeElement[] = new Array(1);
  // Saving the route
  routes: Route[] = ROUTES;
  selectedRoute: Route[] = new Array(1);
  routePositionPointer: number[] = new Array(1);
    // Saving Details
    nameFormControl = new FormControl('', [
        Validators.required,
    ]);
    faultInjectionTimeFormControl = new FormControl('', [
        Validators.required,
    ]);
    numberOfRunsFormControl = new FormControl('', [
        Validators.required,
    ]);
    formGroup = new FormGroup({
        name: this.nameFormControl,
        faultInjectionTime: this.faultInjectionTimeFormControl,
        numberOfRuns: this.numberOfRunsFormControl
        });
    formGroupArray = new FormArray([this.formGroup]);
    matcher = new MyErrorStateMatcher();

  ngOnInit() {
   // $('#mat-tab-label-0-3').keydown(this.addTab);
    console.log('test');
    this.scenarioCounter = 1;
    this.routePositionPointer[0] = 0;
    this.selectedRoute[0] = this.routes[this.routePositionPointer[0]];
  }

  onSelect(modeElement: ModeElement, index: number) {
      this.selectedMode[index] = modeElement;
      console.log(this.selectedMode);
  }

  addTab(selectAfterAdding: boolean, index: number) {
    this.scenarioCounter++;
    this.routePositionPointer[this.scenarioCounter - 1] = 0;
    this.selectedRoute[this.scenarioCounter - 1] = this.routes[0];
      console.log(this.selectedRoute);
      console.log(this.routePositionPointer);
      this.formGroupArray.push(new FormGroup({
          name: new FormControl('', Validators.required),
          faultInjectionTime: new FormControl('', Validators.required),
          numberOfRuns: new FormControl('', Validators.required)
      }));
      console.log(this.formGroupArray);
    this.tabs.push('Scenario ' + this.scenarioCounter);

    if (selectAfterAdding) {
      this.selected.setValue(this.tabs.length - 1);
    }
  }
    updateTabs(event) {
      this.tabs[this.selected.value] = event.currentTarget.value;
    }
  removeTab(index: number) {
    this.tabs.splice(index, 1);
    this.scenarioCounter--;
    this.selectedMode.splice(index, 1);
    this.routePositionPointer.splice(index, 1);
    this.selectedRoute.splice(index, 1);
    this.formGroupArray.removeAt(index);
  }

    onLeftClick(index: number) {
      this.routePositionPointer[index]--;
      if (this.routePositionPointer[index] < 0) {
          this.routePositionPointer[index] = this.routes.length - 1;
      }
        this.selectedRoute[index] = this.routes[this.routePositionPointer[index]];
        console.log(this.selectedRoute);
        console.log(this.routePositionPointer);
    }

    onRightClick(index: number) {
        this.routePositionPointer[index]++;
        if (this.routePositionPointer[index] >= this.routes.length) {
            this.routePositionPointer[index] = 0;
        }
        this.selectedRoute[index] = this.routes[this.routePositionPointer[index]];
        console.log(this.selectedRoute);
        console.log(this.routePositionPointer);
    }

  startTest() {
    console.log('test');
  }
  /*navigateTo(item, event) {
    this.activeItem = item;
  }*/

}


/* LIST CODE */

export interface ModeElement {
    shortName: string;
    fullName: string;
    description: string;
    disbaled: Boolean;
}

export interface Route {
    name: string;
    length: number;
    width: number;
    pits: number;
}

const MODES: ModeElement[] = [
    {
        shortName: 'ACC',
        fullName: 'Adaptive Cruise Control',
        description: 'is an available cruise control system for road vehicles that automatically adjusts the' +
            ' vehicle speed to maintain a safe distance from vehicles ahead. Control is based on sensor information from on-board sensors.',
        disbaled: false
    },
    {
        shortName: 'ADC',
        fullName: 'Autonomous Driving Car',
        description: 'is a vehicle that is capable of sensing its environment and moving with little or no human ' +
            'input. Autonomous cars combine a variety of sensors to perceive their surroundings',
        disbaled: false
    },
    {
        shortName: 'ADAS',
        fullName: 'Advanced Driver-Assistance Systems',
        description: 'are systems to help the driver in the driving process. When designed with a ' +
            'safe human-machine interface, they should increase car safety and more generally road safety.',
        disbaled: true
    },
];

const ROUTES: Route[] = [
    {
        name: 'kia4sm',
        length: 800,
        width: 10,
        pits: 10
    },
    {
        name: 'Grand Prix Circuit',
        length: 1400,
        width: 14,
        pits: 15
    },
    {
        name: 'Speedways',
        length: 600,
        width: 12,
        pits: 8
    },
];
