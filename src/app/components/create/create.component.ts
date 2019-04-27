import {Component, OnInit} from '@angular/core';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormArray, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {InterComponentService} from '../../inter-component.service';
import {Scenario} from '../../models/Scenario';
import {DataService} from '../../data.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
const shell = require('shelljs');


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
  tabs = ['Scenario'];
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
    selectedJSONInput: string[] = new Array(1);
    nameFormControl = new FormControl('', [
        Validators.required,
    ]);
    faultInjectionTimeFormControl = new FormControl('', [
        Validators.required,
        Validators.max(30),
    ]);
    numberOfRunsFormControl = new FormControl('', [
        Validators.required,
    ]);
   fileFormControl = new FormControl('', [
        Validators.required,
    ]);
    formGroup = new FormGroup({
        name: this.nameFormControl,
        faultInjectionTime: this.faultInjectionTimeFormControl,
        numberOfRuns: this.numberOfRunsFormControl,
        file: this.fileFormControl
        });
    formGroupArray = new FormArray([this.formGroup]);
    matcher = new MyErrorStateMatcher();

    constructor(private interComponentService: InterComponentService, private dataService: DataService, public router: Router,
                private snackBar: MatSnackBar) { }
  ngOnInit() {
    this.interComponentService.setButtonHeaderActive(false);
    this.scenarioCounter = 1;
    this.routePositionPointer[0] = 0;
    this.selectedRoute[0] = this.routes[this.routePositionPointer[0]];
    this.testsetName = this.interComponentService.getCreateTestsetName();
  }

  onSelect(modeElement: ModeElement, index: number) {
      this.selectedMode[index] = modeElement;
  }

  addTab(selectAfterAdding: boolean) {
    this.scenarioCounter++;
    this.routePositionPointer[this.scenarioCounter - 1] = 0;
    this.selectedRoute[this.scenarioCounter - 1] = this.routes[0];
      this.formGroupArray.push(new FormGroup({
          name: new FormControl('', Validators.required),
          faultInjectionTime: new FormControl('', [Validators.required, Validators.max(30)]),
          numberOfRuns: new FormControl('', Validators.required),
          file: new FormControl('', Validators.required)
      }));
      this.tabs.push('New Scenario');

    if (selectAfterAdding) {
      this.selected.setValue(this.tabs.length - 1);
    }
  }
    updateTabs(event) {
      this.tabs[this.selected.value] = event.currentTarget.value;
    }
  // Removes array indexes when Tab is removed
  removeTab(index: number) {
    this.tabs.splice(index, 1);
    this.scenarioCounter--;
    this.selectedMode.splice(index, 1);
    this.routePositionPointer.splice(index, 1);
    this.selectedRoute.splice(index, 1);
    this.selectedJSONInput.splice(index,1);
    this.formGroupArray.removeAt(index);
  }
    // Left arrow click for routes
    onLeftClick(index: number) {
      this.routePositionPointer[index]--;
      if (this.routePositionPointer[index] < 0) {
          this.routePositionPointer[index] = this.routes.length - 1;
      }
        this.selectedRoute[index] = this.routes[this.routePositionPointer[index]];
    }
    // Rigth arrow click for routes
    onRightClick(index: number) {
        this.routePositionPointer[index]++;
        if (this.routePositionPointer[index] >= this.routes.length) {
            this.routePositionPointer[index] = 0;
        }
        this.selectedRoute[index] = this.routes[this.routePositionPointer[index]];
    }

    onFileConfigChange(event, index: number) {
        let reader = new FileReader();
        if (event.target.files && event.target.files.length) {
            const [file] = event.target.files;
            reader.readAsText(file);

        }
        reader.onload = () => {
            this.selectedJSONInput[index] = reader.result.toString();
        };
    }

    onSaveExitClick() {
      // Check if one element is not filled
        for (let j = 0; j < this.scenarioCounter; j++) {
            if (!this.formGroupArray.at(j).get('name').valid ||
                this.selectedMode[j] == null || !this.selectedMode[j] ||
                this.selectedRoute[j].name == null || this.selectedRoute[j].name === '' ||
                !this.formGroupArray.at(j).get('faultInjectionTime').valid ||
                !this.formGroupArray.at(j).get('numberOfRuns').valid ||
                !this.formGroupArray.at(j).get('file').valid) {
                    this.snackBar.open('Please fill in all fields in Scenario Tab: ' + this.tabs[j], 'DISMISS', {
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
                'runQuantity': this.formGroupArray.at(i).get('numberOfRuns').value,
                'file': this.selectedJSONInput[i],
                'filePath': this.formGroupArray.at(i).get('file').value._files[0].path,
                'ecuAmount': JSON.parse(this.selectedJSONInput[i]).length
            });
            const command = shell.exec('cp -a ' + this.formGroupArray.at(0).get('file').value._files[0].path + ' ',
                {silent: false, async: true});
        }
        this.dataService.createScenarioBulk(this.testsetName, scenarios).subscribe(data => {
            this.router.navigate(['overview']);
            }
        );
        // Routing to overview
        this.snackBar.open('Testset was created: ' + this.testsetName, 'DISMISS', {
            duration: 5000,
            panelClass: ['customized-snackbar']
        });
    }
}


/* LIST CODE */

export interface ModeElement {
    shortName: string;
    fullName: string;
    description: string;
}

export interface Route {
    name: string;
    length: number;
    width: number;
    pits: number;
    disabled: boolean;
}

const MODES: ModeElement[] = [
    {
        shortName: 'ACC',
        fullName: 'Adaptive Cruise Control',
        description: 'is an available cruise control system for road vehicles that automatically adjusts the' +
            ' vehicle speed to maintain a safe distance from vehicles ahead. Control is based on sensor information from on-board sensors.',
    }/*,
    {
        shortName: 'ADC',
        fullName: 'Autonomous Driving Car',
        description: 'is a vehicle that is capable of sensing its environment and moving with little or no human ' +
            'input. Autonomous cars combine a variety of sensors to perceive their surroundings',
    },
    {
        shortName: 'ADAS',
        fullName: 'Advanced Driver-Assistance Systems',
        description: 'are systems to help the driver in the driving process. When designed with a ' +
            'safe human-machine interface, they should increase car safety and more generally road safety.',
    },*/
];

const ROUTES: Route[] = [
    /*{
        name: 'kia4sm',
        length: 800,
        width: 10,
        pits: 10,
        disabled: false,
    },
    {
        name: 'Grand Prix Circuit',
        length: 1400,
        width: 14,
        pits: 15,
        disabled: true,
    },*/
    {
        name: 'Speedways',
        length: 600,
        width: 12,
        pits: 8,
        disabled: true,
    }
];
