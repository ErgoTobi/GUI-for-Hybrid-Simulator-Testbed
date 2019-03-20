import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../../data.service';
import {FormControl} from '@angular/forms';
import {MatSort, MatTableDataSource} from '@angular/material';
import {TestsetResult} from '../../models/TestsetResult';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
    public displayedColumns = ['name', 'id', 'duration', 'Testset_id'];
    dataSource = new MatTableDataSource<TestsetResult>();

    @ViewChild(MatSort) sort: MatSort;

    constructor(private dataService: DataService) {
    }

    ngOnInit() {
        this.dataService.readAllTestsetResultsOnly().subscribe(
            data => {
                this.dataSource.data = data as TestsetResult[];
                console.log(data);
            }
        );
    }
    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
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
