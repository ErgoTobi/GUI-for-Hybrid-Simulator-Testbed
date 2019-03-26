import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../../data.service';
import {Testsets} from '../../models/TestsetResult';
import {Testset} from '../../models/Testset';
import {MatDialog} from '@angular/material';
import {DeleteDialogComponent} from '../overview-detail/delete-dialog/delete-dialog.component';
import {SettingsDialogComponent} from '../settings-dialog/settings-dialog.component';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
    testsets: Testset[];
    testsetsOnLoad: Testset[];
    selectedTestset: Testset;
    constructor(private dataService: DataService, public dialog: MatDialog) {
    }

    ngOnInit() {
        this.dataService.readAllTestsets().subscribe(
            data => {
                this.testsets = data as Testset[];
                this.testsetsOnLoad = data as Testset[];
                console.log(data);
                // Autoselects first item in list
                this.selectedTestset = this.testsets[0];
            }
        );
    }

    onSelect(testset: Testset) {
        this.selectedTestset = testset;
        console.log(this.selectedTestset);
    }

    doFilter = (value: string) => {
        if (value === '' || value.length === 1) { this.testsets = this.testsetsOnLoad; }
        this.testsets = this.testsets.filter(testset => testset.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }

    openSettingsDialog() {
        const dialogRef = this.dialog.open(SettingsDialogComponent, {
            data: {
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            console.log(result);
        });
    }

    onRowClicked(row) {
        console.log('Row clicked: ', row);
        console.log('id of row');
        console.log(row.id);
    }
}
