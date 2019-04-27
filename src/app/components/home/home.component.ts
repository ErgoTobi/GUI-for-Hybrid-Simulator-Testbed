import {Component, OnInit, ElementRef, ViewChild, OnChanges} from '@angular/core';
import {DataService} from '../../data.service';
import {Setting} from '../../models/Setting';
import {Scenario} from '../../models/Scenario';
import {Router} from '@angular/router';
import {InterComponentService} from '../../inter-component.service';
const shell = require('shelljs');
declare function require(url: string);

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    settings: Setting[];

    @ViewChild('lastNameInput') nameInputRef: ElementRef;

    constructor(private dataService: DataService, private router: Router, private interComponentService: InterComponentService) {}

    ngOnInit() {
        this.interComponentService.setButtonHeaderActive(false);
        this.dataService.readAllSettings().subscribe(
            data => {
                this.settings = data as Setting[];

                if (this.interComponentService.getAutomaticNavigation()) {
                    // Direct navigation to previously selected module with flag === true
                    for (const setting of this.settings) {
                        if (setting.selectedModule === true) {
                            if (setting.id === 1) {
                                this.interComponentService.setAutomaticNavigation(false);
                                this.router.navigate(['overview']);
                            }
                        }
                    }
                }
            }
        );
    }
    clearSelectedModules () {
        for (const setting of this.settings) {
            this.dataService.updateSettingModule(setting.id, false);
        }
    }

    selectModuleSpeeddreams() {
        this.clearSelectedModules();
        this.dataService.updateSettingModule(1, true);
    }

    selectModuleRobot() {
        this.clearSelectedModules();
        this.dataService.updateSettingModule(2, true);
    }

    test() {
        const nodePath = (shell.which('node').toString());
        shell.config.execPath = nodePath;
        let command = shell.exec('/home/user1/speed-dreams/build/games/speed-dreams-2 -s quickrace', {silent: false, async: true});

        shell.cd('/home/user1/operating-system/');
        let command2 = shell.exec('echo administrator | sudo -S make vde', {silent: false, async: true});

        let command3 = shell.exec('PROJECT=idp_acc make jenkins_run', {silent: false, async: true});
        command3.stdout.on('data', function (data) {
            if (data.includes('mosquitto server')) {
                let command4 = shell.exec('PROJECT=idp_savm make jenkins_run', {silent: false, async: true});
            }
        });
    }
}
