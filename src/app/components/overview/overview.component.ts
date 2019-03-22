import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../../data.service';
import {FormControl} from '@angular/forms';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Testsets} from '../../models/TestsetResult';
import { TESTSET } from '../../mock-data';
import { SCENARIO } from '../../mock-data';
import {Testset} from '../../data';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
    testsets = TESTSET;


    selectedTestset: Testset;


    dataSource = new MatTableDataSource<Testsets>();
    /*
    public displayedColumns = ['name'];
    @ViewChild(MatSort) sort: MatSort;
*/
    constructor(private dataService: DataService) {
    }

    ngOnInit() {
        this.dataService.readAllTestsets().subscribe(
            data => {
                this.dataSource.data = data as Testsets[];
                console.log(data);
            }
        );
    }
    /*
    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
    }*/

    onSelect(testset: Testset) {
        this.selectedTestset = testset;
        console.log(this.selectedTestset);
    }

    doFilter = (value: string) => {
        this.dataSource.filter = value.trim().toLocaleLowerCase();
    }

    onRowClicked(row) {
        console.log('Row clicked: ', row);
        console.log('id of row');
        console.log(row.id);
    }
}
