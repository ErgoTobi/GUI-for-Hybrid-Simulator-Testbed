import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from '../../data.service';
import {Testsets} from '../../models/Result';
import {Testset} from '../../models/Testset';
import {MatDialog} from '@angular/material';
import {CreateTestsetDialogComponent} from './create-testset-dialog/create-testset-dialog.component';
import {InterComponentService} from '../../inter-component.service';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
    testsets: Testset[];
    testsetsOnLoad: Testset[];
    selectedTestset: Testset;
    subscription;
    constructor(private dataService: DataService, public dialog: MatDialog, private interComponentService: InterComponentService) {}

    ngOnInit() {
        this.interComponentService.setButtonHeaderActive(true);
        this.interComponentService.setAutomaticNavigation(false);
        this.subscription = this.dataService.readAllTestsets().subscribe(
            data => {
                this.testsets = data as Testset[];
                this.testsetsOnLoad = data as Testset[];
                console.log(data);
                // Autoselects first item in list
                this.selectedTestset = this.testsets[0];
            }
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onSelect(testset: Testset) {
        this.selectedTestset = testset;
    }

    doFilter = (value: string) => {
        if (value === '' || value.length === 1) { this.testsets = this.testsetsOnLoad; }
        this.testsets = this.testsets.filter(testset => testset.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }
    openCreateDialog(): void {
        const dialogRef = this.dialog.open(CreateTestsetDialogComponent, {
            data: {
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }
}
