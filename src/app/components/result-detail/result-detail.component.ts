import {AfterViewInit, Component, Input, OnInit, NgZone, ViewChild, ElementRef} from '@angular/core';
import {RunDetail} from '../../models/RunDetail';
import {DataService} from '../../data.service';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_kelly from '@amcharts/amcharts4/themes/kelly';

am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_kelly);

@Component({
    selector: 'app-result-detail',
    templateUrl: './result-detail.component.html',
    styleUrls: ['./result-detail.component.scss']
})
export class ResultDetailComponent implements OnInit, AfterViewInit {
    @Input() run;
    @ViewChild('chartDiv') chartDiv: ElementRef;
    private chart: am4charts.XYChart;
    runData;
    loadCounter;


    constructor(private dataService: DataService, private zone: NgZone) {
    }

    ngOnInit() {
        this.dataService.readAllRunDetailsByRunId(1).subscribe(
            data => {//
                const castedData = (data as any);
                for (let i = 0; i < castedData.length; i++) {
                    castedData[i] = castedData[i].dataValues;
                }
                this.runData = castedData;
                this.loadCharts();
            });
    }

    ngAfterViewInit() {
    }

    loadCharts() {
        // check for any new element being inserted here,
        // or a particular node being modified
        // The container has been added to the DOM
        if (document.getElementById('chartdiv')) {
                this.loadCounter = 0;
                let chart = am4core.create('chartdiv', am4charts.XYChart);

                chart.paddingRight = 20;

                let data = [];
                let visits = 10;
                for (let i = 1; i < 366; i++) {
                    visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
                    data.push({date: new Date(2018, 0, i), name: 'name' + i, value: visits});
                }

                chart.data = data;

                let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
                dateAxis.renderer.grid.template.location = 0;

                let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis.tooltip.disabled = true;
                valueAxis.renderer.minWidth = 35;

                let series = chart.series.push(new am4charts.LineSeries());
                series.dataFields.dateX = 'date';
                series.dataFields.valueY = 'value';

                series.tooltipText = '{valueY.value}';
                chart.cursor = new am4charts.XYCursor();

                let scrollbarX = new am4charts.XYChartScrollbar();
                scrollbarX.series.push(series);
                chart.scrollbarX = scrollbarX;

                this.chart = chart;
    } else {
            setTimeout(() => this.loadCharts(), 500);
}
}

generateChartData() {
    let chartData = [];
    let firstDate = new Date();
    firstDate.setDate(firstDate.getDate() - 1000);
    let visits = 1200;
    for (let i = 0; i < 500; i++) {
        // we create date objects here. In your data, you can have date strings
        // and then set format of your dates using chart.dataDateFormat property,
        // however when possible, use date objects, as this will speed up chart rendering.
        let newDate = new Date(firstDate);
        newDate.setDate(newDate.getDate() + i);

        visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);

        chartData.push({
            date: newDate,
            visits: visits
        });
    }
    return chartData;
}

}
