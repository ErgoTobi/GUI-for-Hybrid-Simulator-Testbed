import { Injectable } from '@angular/core';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Time} from '@angular/common';
import {from, Timestamp} from 'rxjs';
import {forEach} from '@angular/router/src/utils/collection';
const Rx = require('rx');
import {Scenario} from './models/Scenario';
import {RunDetail} from './models/RunDetail';
import {InterComponentService} from './inter-component.service';

const Sequelize = require('sequelize');
const connection = new Sequelize('suite_simulator', 'root', 'password', {
    dialect: 'mysql'
});
const Testset = require('./models/Testset')(connection, Sequelize);
const Scenario = require('./models/Scenario')(connection, Sequelize);
const Result = require('./models/Result')(connection, Sequelize);
const Run = require('./models/Run')(connection, Sequelize);
const Rundetail = require('./models/RunDetail')(connection, Sequelize);
const Setting = require('./models/Setting')(connection, Sequelize);

const Promise = require('promise');
Scenario.belongsTo(Testset);
Testset.hasMany(Scenario);
Result.belongsTo(Testset);
Testset.hasMany(Result);
Run.belongsTo(Result);
Result.hasMany(Run);
Rundetail.belongsTo(Run);
Run.hasMany(Rundetail);

@Injectable({
    providedIn: 'root'
})

export class DataService {
    constructor(private interComponentService: InterComponentService) {
    }

    authenticateDatabase () {
        connection
            .authenticate()
            .then(() => {
                console.log('Connection to Database has been established successfully.');
                this.interComponentService.setDatabaseConnected(true);
            })
            .catch(err => {
                console.error('Unable to connect to the database!');
                this.interComponentService.setDatabaseConnected(false);
            });
    }

    // SETTING
    // R(w): Pulls a setting where the Suite_id equals SpeedDreams; Overview
    readSettingById (id: number) {
        return fromPromise(Setting.findOne({
            where: { id: id },
        }));
    }
    readAllSettings () {
        return fromPromise(Setting.findAll({}));
    }
    // C(w): ECU create
    createSetting(ecuAmount: number, isTextOnly: Boolean) {
        return fromPromise(Setting.create({
            isTextOnly: isTextOnly
        }).catch(error => {
            console.error('createSetting:', error);
        }));
    }
    // C(w): Setting update
    updateSettingDialog(id: number, isTextOnly?: Boolean, password?: string) {
        return fromPromise(Setting.update({
            isTextOnly: isTextOnly,
            password: password
        }, {
            returning: true,
            where: {
                id: id
            }
        }).catch(error => {
            console.error('updateSettingDialog:', error);
        }));
    }
    updateSettingModule(id: number, selectedModule: Boolean) {
        return fromPromise(Setting.update({
            selectedModule: selectedModule
        }, {
            returning: true,
            where: {
                id: id
            }
        }).catch(error => {
            console.error('updateSettingDialog:', error);
        }));
    }

    // TESTSET
    // C(w): Creates a testset and returns the model back via a promise; Create -> Overview
    createTestset (name: String) {
        return fromPromise(Testset.create({
            name: name
        }).catch(error => {
            console.error('createTestset:', error);
        }));
    }
    // R(w): Pulls all testsets (incl. scenario data) where the Suite_id equals SpeedDreams; Overview
    readAllTestsets () {
        return fromPromise(Testset.findAll({
            order: [
                ['id', 'DESC']
            ],
            include: [{
                model: Scenario
            }]
        }));
    }
    // R(w): Pulls a testset (incl. scenario data) by id that the method gets from onclick event; Overview -> Running
    readTestsetById (testsetId: number) {
        return fromPromise(Testset.findByPk(testsetId, {
            include: [{
                model: Scenario,
                where: {
                    testsetId: testsetId
                }
            }]
        }));
    }
    // D(w): Deletes a testset (incl. cascading deletion of cohesive data) by id that the method gets from on onclick event; Overview
    deleteTestsetById (testsetId: number) {
        // One need to destroy Scenario first since there is a circular dependecy if foreign key is activated
        Testset.destroy({
            where: {
                id: testsetId
            },
            force: true
        });
    }
    // D(w)Clear all Testsets incl. associated data
    clearAllTestsetsInDatabase () {
        return fromPromise(Testset.destroy({
            truncate: { cascade: true }
        }));
    }

    // SCENARIO
    // C(w): Creates a scenario; Create
    createScenario (name: String, mode: String, route: String, runQuantity: number, testsetId: number) {
        return fromPromise(Scenario.create({
            name: name,
            mode: mode,
            route: route,
            runQuantity: runQuantity,
            testsetId: testsetId
        }).catch(error => {
            console.error('createScenario:', error);
        }));
    }
    // C(w): Creates a bulk of scenarios; Create
    createScenarioBulk (testsetName: string, scenarios: Scenario[]) {
        let promise = Testset.create({
            name: testsetName
        }).then(function (data) {
            let id = data.id;
            // console.log(data.dataValues.id);
            scenarios.forEach(function (element) {
                element.testsetId = id;
            });
            return fromPromise(Scenario.bulkCreate(scenarios).catch(error => {
                console.error('createScenarioBulk: ', error);
            }));
        });
        return fromPromise(promise);
    }

    // TESTSETRESULT
    // C(w): Creates a result and returns the model back via a promise; Running -> Overview
    createResult (name: String, startTimestamp: number, duration: string, testsetId: number) {
        return fromPromise(Result.create({
            name: name,
            startTimestamp: startTimestamp,
            duration: duration,
            testsetId: testsetId
        }).catch(error => {
            console.error('createResult: ', error);
        }));
    }
    // R(w): Pulls all results; Resultoverview
    readAllResults () {
        return fromPromise(Result.findAll({
            order: [
                ['createdAt', 'DESC']
            ],
            include: [{
                model: Run
            }]
        }));
    }
    // D(w): Deletes a result (incl. cascading deletion of cohesive data) by id that the method gets from on onclick event; Overview
    deleteResultById (resultId: number) {
        Result.destroy({
            where: {
                id: resultId
            },
            force: true
        });
    }
    // D(w)Clears all Results incl. associated data
    clearAllResultstsInDatabase () {
        return fromPromise(Result.destroy({
            truncate: { cascade: true }
        }));
    }

    // RUN
    // C(w): Creates a run; Running
    createRun (startTimestamp: number, duration: string, state: number, scenarioId: number, resultId: number) {
        return fromPromise(Run.create({
            startTimestamp: startTimestamp, // To add to database
            duration: duration,
            state: state, // state 1 = passed, 0 = failed, 3 = pending
            scenarioId: scenarioId,
            resultId: resultId
        }).catch(error => {
            console.error('createRun: ', error);
        }));
    }
    // R(w): Pulls all run (only!) by result Id; Resultdetails
    readAllRunsByResultId (resultId: number) {
        return fromPromise(Run.findAll({
            // raw: true,
            where: {
                resultId: resultId
            }
        }));
    }
    // U(w): Updates a run; Running
    updateRunByResultId (runId: number, duration: string, state: number) {
        return fromPromise(Run.update({
            duration: duration,
            state: state, // state 1 = passed, 0 = failed, 3 = pending
        }, {
            returning: true,
            where: {
                id: runId
            }
        }).catch(error => {
            console.error('updateRun: ', error);
        }));
    }

    // RUNDATA
    // C(w): Creates a rundata; Running
    createRunDetail (relativeTime: string, key: string, value: string, runId: number) {
        return fromPromise(Rundetail.create({
            relativeTime: relativeTime,
            key: key,
            value: value,
            runId: runId
        }).catch(error => {
            console.error('createRunDetail: ', error);
        }));
    }
    // C(w): Creates a bulk of runresultdata; Running
    createRunDetailBulk (runDetails: RunDetail[]) {
        return fromPromise(Rundetail.bulkCreate(runDetails).catch(error => {
            console.error('createRunDetailBulk: ', error);
        }));
    }
    // R(w): Pulls all rundata(only!) by run Id; Resultdetails
    readAllRunDetailsByRunId (runId: number) {
        return Rx.Observable.interval(10000).flatMap(() => {
            return fromPromise(Rundetail.findAll({
                where: {
                    runId: runId
                }
            }));
        });
    }
    readAllRunDetailsByRunIdKeyValue (runId: number) {
        return fromPromise(Rundetail.findAll({
            attributes: ['relativeTime', 'key', 'value'],
            where: {
                runId: runId
            }
        }));
    }
    readLast100RunDetailsByRunResultId (runId: number) {
        return Rx.Observable.interval(10000).flatMap(() => {
            return fromPromise(Rundetail.findAll({
                limit: 100,
                where: {
                    runId: runId
                },
                order: [['id', 'DESC']]
            }));
        });
    }


    // Testmethods
    // C(): Creates results
    createDummyResultData () {
        Result.create({
            name: 'TR',
            Run: {
                state: 1,
            }
        }, {
            include: Run
        }).then(() => console.log('Worked'));
    }
    readResultByIdObject (resultId: object) {
        return fromPromise(Result.findAll({
            attributes: ['id', 'name', 'startTimestamp', 'duration', 'testsetId'],
            where: { id: resultId },
        }));
    }

    readTestsetByIdObject (testsetId: object) {
        return fromPromise(Testset.findAll({
            attributes: ['id', 'name'],
            where: { id: testsetId },
            include: [{
                model: Scenario
            }]
        }));
    }
}