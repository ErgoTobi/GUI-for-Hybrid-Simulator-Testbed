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
    }

    ngAfterViewInit() {
  this.loadData();
    }
    loadData() {
        if (this.run) {
            this.dataService.readAllRunDetailsByRunIdKeyValue(this.run.id).subscribe(
                data => {//
                    const castedData = (data as any);
                    for (let i = 0; i < castedData.length; i++) {
                        castedData[i] = castedData[i].dataValues;
                    }
                    this.runData = castedData;
                    this.loadCharts();
                });
        } else { setTimeout(() => this.loadData(), 1000); }
    }

    loadCharts() {
        // check for any new element being inserted here,
        // or a particular node being modified
        // The container has been added to the DOM
        if (document.getElementById('chartdiv')) {
                this.loadCounter = 0;
            const chart = am4core.create('chartdiv', am4charts.XYChart);

// Add data
            chart.data = [{
                "date": "00:19:12",
                "value": 13
            }, {
                "date": "00:19:14",
                "value": 11
            }, {
                "date": "00:19:16",
                "value": 15
            }, {
                "date": "00:19:18",
                "value": 16
            }, {
                "date": "00:19:19",
                "value": 18
            }, {
                "date": "00:19:20",
                "value": 13
            }, {
                "date": "00:19:21",
                "value": 22
            }, {
                "date": "00:19:24",
                "value": 23
            }, {
                "date": "00:19:25",
                "value": 20
            }];

// Set input format for the dates
            chart.dateFormatter.inputDateFormat = "HH-mm-ss";

// Create axes
            let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

// Create series
            const series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "value";
            series.dataFields.dateX = "date";
            series.tooltipText = "{value}";
            series.strokeWidth = 2;
            series.minBulletDistance = 15;

// Drop-shaped tooltips
            series.tooltip.background.cornerRadius = 20;
            series.tooltip.background.strokeOpacity = 0;
            series.tooltip.pointerOrientation = "vertical";
            series.tooltip.label.minWidth = 40;
            series.tooltip.label.minHeight = 40;
            series.tooltip.label.textAlign = "middle";
            series.tooltip.label.textValign = "middle";

// Make bullets grow on hover
            let bullet = series.bullets.push(new am4charts.CircleBullet());
            bullet.circle.strokeWidth = 2;
            bullet.circle.radius = 4;
            bullet.circle.fill = am4core.color("white");

            let bullethover = bullet.states.create("hover");
            bullethover.properties.scale = 1.3;

// Make a panning cursor
            chart.cursor = new am4charts.XYCursor();
            chart.cursor.behavior = "panXY";
            chart.cursor.xAxis = dateAxis;
            chart.cursor.snapToSeries = series;

// Create vertical scrollbar and place it before the value axis
            chart.scrollbarY = new am4core.Scrollbar();
            chart.scrollbarY.parent = chart.leftAxesContainer;
            chart.scrollbarY.toBack();

// Create a horizontal scrollbar with previe and place it underneath the date axis
            chart.scrollbarX = new am4charts.XYChartScrollbar();
            //chart.scrollbarX.series.push(series);
            chart.scrollbarX.parent = chart.bottomAxesContainer;

            chart.events.on('ready', function () {
                dateAxis.zoom({start: 0.79, end: 1});
            });
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
