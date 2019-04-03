import {Component, Inject, OnInit} from '@angular/core';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormArray, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {InterComponentService} from '../../inter-component.service';
import {Scenario} from '../../models/Scenario';
import {DataService} from '../../data.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

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

    testsetName: string;
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

    constructor(private interComponentService: InterComponentService, private dataService: DataService, public router: Router,
                private snackBar: MatSnackBar) { }
  ngOnInit() {
   // $('#mat-tab-label-0-3').keydown(this.addTab);
    console.log('test');
    this.scenarioCounter = 1;
    this.routePositionPointer[0] = 0;
    this.selectedRoute[0] = this.routes[this.routePositionPointer[0]];
    this.testsetName = this.interComponentService.getCreateTestsetName();
  }

  /*
  catchCreateTestsetName(emittedName: string) {
      this.testsetName = emittedName;
      console.log('Caught TestsetName: ' + this.testsetName);
  }*/

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

    onSaveExitClick() {
      /*
        let scenarios2: Scenario[] = [
            { 'name': 'WSBulkScenario1', 'mode': 'ACC', 'route': 'Speedways', 'faultInjectionTime': 45, 'runQuantity': 10,
                'testsetId': 0},
            { 'name': 'WSBulkScenario2', 'mode': 'ACC', 'route': 'Speedways', 'faultInjectionTime': 45, 'runQuantity': 10,
                'testsetId': 0},
            { 'name': 'WSBulkScenario3', 'mode': 'ACC', 'route': 'Speedways', 'faultInjectionTime': 45, 'runQuantity': 10,
                'testsetId': 0},
            { 'name': 'WSBulkScenario4', 'mode': 'ACC', 'route': 'Speedways', 'faultInjectionTime': 45, 'runQuantity': 10,
                'testsetId': 0}
        ];*/
      // Check if one element is not filled
        for (let j = 0; j < this.selectedMode.length; j++) {
            if (!this.formGroupArray.at(j).get('name').valid ||
                this.selectedMode[j].shortName == null || this.selectedMode[j].shortName === '' ||
                this.selectedRoute[j].name == null || this.selectedRoute[j].name === '' ||
                !this.formGroupArray.at(j).get('faultInjectionTime').valid ||
                !this.formGroupArray.at(j).get('numberOfRuns').valid) {
                    console.log('0.1: ' + !this.formGroupArray.valid);
                    console.log('0.2: ' + !this.formGroupArray.at(j).valid);
                    console.log('1: ' + !this.formGroupArray.at(j).get('name').valid);
                    console.log('2: ' + this.selectedMode[j]);
                    console.log('3: ' + this.selectedRoute[j]);
                    console.log('4: ' + !this.formGroupArray.at(j).get('faultInjectionTime').valid);
                    console.log('5: ' + !this.formGroupArray.at(j).get('numberOfRuns').valid);

                    this.snackBar.open('Please fill in all values in Scenario:     ' + this.tabs[j], 'DISMISS', {
                        duration: 10000,
                        panelClass: ['customized-snackbar']
                    });
                    return ;
            }
        }
        let scenarios: Scenario[] = new Array(this.selectedRoute.length);
        let i: number;
        for (i = 0; i < this.selectedMode.length; i++) {
            scenarios.splice(i, 1, {
                'name': this.formGroupArray.at(i).get('name').value,
                'mode': this.selectedMode[i].shortName,
                'route': this.selectedRoute[i].name,
                'faultInjectionTime': this.formGroupArray.at(i).get('faultInjectionTime').value,
                'runQuantity': this.formGroupArray.at(i).get('numberOfRuns').value
            });
        }
        console.log(scenarios);
        this.dataService.createScenarioBulk(this.testsetName, scenarios).subscribe(data => {
                console.log('createTestsetScenariosBulk'); console.log(data);
            }
        );
        // Routing to overview
        this.snackBar.open('Testset was created: ' + this.testsetName, 'DISMISS', {
            duration: 5000,
            panelClass: ['customized-snackbar']
        });
        this.router.navigate(['overview']);

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
