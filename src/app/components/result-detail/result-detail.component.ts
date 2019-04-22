import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, NgZone, OnInit, ViewChild, OnChanges} from '@angular/core';
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
export class ResultDetailComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() run;
    @ViewChild('chartDiv') chartDiv: ElementRef;
    private chart: am4charts.XYChart;
    runData;
    loadCounter;


    constructor(private dataService: DataService, private zone: NgZone) {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        this.loadData();
    }
    loadData() {
        if (this.run) {
            this.dataService.readAllRunDetailsByRunIdKeyValue(this.run.id).subscribe(
                data => {//
                    const castedData = (data as any);
                    const convertedData = [];
                    const runData = [];
                    const distinctValues = [new Set(castedData.map(val => val.dataValues.relativeTime))];
                    distinctValues[0].forEach(element => {
                        convertedData.push(castedData.filter(this.filterRunData, element));
                    });
                    for (let i = 0; i < convertedData.length; i++) {
                        if (convertedData[i][0] && convertedData[i][1]) {
                            const dataEntry = convertedData[i].find(entry => entry.key === 'savm/car/0/ownSpeed');
                            const dataEntry2 = convertedData[i].find(entry => entry.key === 'ecu/acc/steer');
                            const dataEntry3 = convertedData[i].find(entry => entry.key === 'savm/car/0/leadSpeed' && entry.value < 100);
                            runData.push({
                                'date': convertedData[i][0].relativeTime,
                                'value': dataEntry ? +dataEntry.value : undefined,
                                'value2': dataEntry2 ? +dataEntry2.value : undefined,
                                'value3': dataEntry3 ? +dataEntry3.value : undefined
                            });
                        }
                    }
                    this.runData = runData;
                    if (runData.length > 0) {
                        this.loadCharts();
                    }
                });
        } else { setTimeout(() => this.loadData(), 1000); }
    }
    ngAfterViewInit() {
    }

    loadCharts() {
        // check for any new element being inserted here,
        // or a particular node being modified
        // The container has been added to the DOM
        if (document.getElementById('chartdiv')) {
            am4core.useTheme(am4themes_animated);
// Create chart instance
            let chart = am4core.create('chartdiv', am4charts.XYChart);

// Increase contrast by taking evey second color
            chart.colors.step = 2;

// Add data
            chart.data = this.runData;

// Create axes
            const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.minGridDistance = 50;
            chart.dateFormatter.inputDateFormat = 'HH-mm-ss-SSS';
            this.createAxisAndSeries(chart, 'value', 'Lead Car Speed', 'false', 'circle');
            this.createAxisAndSeries(chart, 'value2', 'ECU Steer', true, 'triangle');
            this.createAxisAndSeries(chart, 'value3', 'ACC Car Speed', true, 'rectangle');

            // Create vertical scrollbar and place it before the value axis
            chart.scrollbarY = new am4core.Scrollbar();
            chart.scrollbarY.parent = chart.leftAxesContainer;
            chart.scrollbarY.toBack();
// Add legend
            chart.legend = new am4charts.Legend();

// Add cursor
            chart.cursor = new am4charts.XYCursor();
    } else {
            setTimeout(() => this.loadCharts(), 500);
}
}

// Create series
createAxisAndSeries (chart, field, name, opposite, bullet) {
        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = field;
        series.dataFields.dateX = 'date';
        series.strokeWidth = 2;
        series.yAxis = valueAxis;
        series.name = name;
        series.tooltipText = '{name}: [bold]{valueY}[/]';
        series.tensionX = 0.8;
        series.minBulletDistance = 15;

        let interfaceColors = new am4core.InterfaceColorSet();

        switch (bullet) {
            case 'triangle':
                let bulletst = series.bullets.push(new am4charts.Bullet());
                bulletst.width = 12;
                bulletst.height = 12;
                bulletst.horizontalCenter = 'middle';
                bulletst.verticalCenter = 'middle';

                let triangle = bulletst.createChild(am4core.Triangle);
                triangle.stroke = interfaceColors.getFor('background');
                triangle.strokeWidth = 2;
                triangle.direction = 'top';
                triangle.width = 12;
                triangle.height = 12;
                break;
            case 'rectangle':
                let bulletsr = series.bullets.push(new am4charts.Bullet());
                bulletsr.width = 10;
                bulletsr.height = 10;
                bulletsr.horizontalCenter = 'middle';
                bulletsr.verticalCenter = 'middle';
                bulletsr.minBulletDistance = 15;

                let rectangle = bulletsr.createChild(am4core.Rectangle);
                rectangle.stroke = interfaceColors.getFor('background');
                rectangle.strokeWidth = 2;
                rectangle.width = 10;
                rectangle.height = 10;
                break;
            default:
                let bulletsd = series.bullets.push(new am4charts.CircleBullet());
                bulletsd.circle.stroke = interfaceColors.getFor('background');
                bulletsd.circle.strokeWidth = 2;
                bulletsd.minBulletDistance = 15;
                break;
        }

        valueAxis.renderer.line.strokeOpacity = 1;
        valueAxis.renderer.line.strokeWidth = 2;
        valueAxis.renderer.line.stroke = series.stroke;
        valueAxis.renderer.labels.template.fill = series.stroke;
        valueAxis.renderer.opposite = opposite;
        valueAxis.renderer.grid.template.disabled = true;
    }

filterRunData(data) {
        return data.relativeTime === this && (data.key === 'ecu/acc/steer' ||  data.key === 'savm/car/0/ownSpeed' ||  data.key === 'savm/car/0/leadSpeed');
}

}
