import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../../data.service';
import {FormControl} from '@angular/forms';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Testsets} from '../../models/TestsetResult';
import { TESTSET } from '../../mock-data';
import {Testset} from '../../models/Testset';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
    testsets: Testset[];
    testsetsOnLoad: Testset[];
    selectedTestset: Testset;
    constructor(private dataService: DataService) {
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

    onRowClicked(row) {
        console.log('Row clicked: ', row);
        console.log('id of row');
        console.log(row.id);
    }
}
