import { Injectable } from '@angular/core';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Time} from '@angular/common';
import {from, Timestamp} from 'rxjs';


const Sequelize = require('sequelize');
const connection = new Sequelize('suite_simulator', 'root', 'password', {
    dialect: 'mysql'
});
const Testset = require('./models/Testset')(connection, Sequelize);
const Scenario = require('./models/Scenario')(connection, Sequelize);
const Testsetresult = require('./models/TestsetResult')(connection, Sequelize);
const Scenarioresult = require('./models/ScenarioResult')(connection, Sequelize);
const Runresult = require('./models/RunResult')(connection, Sequelize);
const Rundetail = require('./models/RunDetail')(connection, Sequelize);
const Setting = require('./models/Setting')(connection, Sequelize);

const Promise = require('promise');
Scenario.belongsTo(Testset);
Testset.hasMany(Scenario);
Testsetresult.belongsTo(Testset);
Testset.hasMany(Testsetresult);
Scenarioresult.belongsTo(Testsetresult);
Testsetresult.hasMany(Scenarioresult);
Runresult.belongsTo(Scenarioresult);
Scenarioresult.hasMany(Runresult);
Rundetail.belongsTo(Runresult);
Runresult.hasMany(Rundetail);

@Injectable({
    providedIn: 'root'
})

export class DataService {

    authenticateDatabase () {
        connection
            .authenticate()
            .then(() => {
                console.log('Connection to Database has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database :', err);
            });
    }

    // SETTING
    // R(): Pulls a setting where the Suite_id equals SpeedDreams; Overview
    readSettingById (id: number) {
        return fromPromise(Testset.findOne({
            where: { id: id },
            raw: true,
        }));
    }
    // U(): ECU update
    updateSetting(ecuAmount: number) {
        Setting.create({
            ecuAmount: ecuAmount
        }).catch(error => {
            console.error('createSetting:', error);
        });
    }

    // TESTSET
    // C(w): Creates a testset; Create -> Overview
    createTestset (name: String) {
        Testset.create({
            name: name
        }).catch(error => {
            console.error('createTestset:', error);
        });
    }
    // R(w): Pulls all testsets (incl. scenario data) where the Suite_id equals SpeedDreams; Overview
    readAllTestsets () {
        return fromPromise(Testset.findAll({
            raw: true,
            include: [{
                model: Scenario
            }]
        }));
    }
    // R(w): Pulls a testset (incl. scenario data) by id that the method gets from onclick event; Overview -> Running
    readTestsetById (testsetId: number) {
        return fromPromise(Testset.findOne({
            where: { id: testsetId },
            raw: true,
            include: [{
                model: Scenario
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

    // SCENARIO
    // C(w): Creates a scenario; Create
    createScenario (name: String, mode: String, route: String, runQuantity: number, isTextOnly: Boolean, testsetId: number) {
        Scenario.create({
            name: name,
            mode: mode,
            route: route,
            runQuantity: runQuantity,
            isTextOnly: isTextOnly,
            testsetId: testsetId
        }).catch(error => {
            console.error('createScenario:', error);
        });
    }

    // TESTSETRESULT
    // C(w): Creates a testsetresult; Running -> Overview
    createTestsetResult (name: String, startTimestamp: Timestamp<any>, duration: Time, testsetId: number) {
        Testsetresult.create({
            name: name,
            startTimestamp: startTimestamp,
            duration: duration,
            testsetId: testsetId
        }).catch(error => {
            console.error('createTestsetResult: ', error);
        });
    }
    // R(w): Pulls all testsetsresults (only!); Resultoverview
    readAllTestsetResultsOnly () {
        return fromPromise(Testsetresult.findAll({
            raw: true,
        }));
    }
    // D(w): Deletes a testset (incl. cascading deletion of cohesive data) by id that the method gets from on onclick event; Overview
    deleteTestsetResultById (testsetresultId: number) {
        Testsetresult.destroy({
            where: {
                id: testsetresultId
            },
            force: true
        });
    }

    // SCENARIORESULT
    // C(w): Creates a scenarioresult; Running
    createScenarioResult (name: String, startTimestamp: Timestamp<any>, duration: Time, scenarioId: number, testsetresultId: number) {
        Scenarioresult.create({
            name: name,
            startTimestamp: startTimestamp,
            duration: duration,
            scenarioId: scenarioId,
            testsetResultId: testsetresultId
        }).catch(error => {
            console.error('createScenarioResult: ', error);
        });
    }
    // R(): Pulls all scenarioresults (only!) by testsetresult Id; Resultdetails
    readAllScenarioResultsByTestsetResultId (testsetResultId: number) {
        // let eventId = event.currentTarget;
        return fromPromise(Scenarioresult.findAll({
            raw: true,
            where: {
                id: testsetResultId
            }
        }));
    }

    // RUNRESULT
    // C(): Creates a runresult; Running
    createRunResult (startTimestamp: Timestamp<any>, duration: Time, state: String, scenarioresultId: number) {
        Runresult.create({
            startTimestamp: startTimestamp, // To add to database
            duration: duration,
            state: state,
            scenarioResultId: scenarioresultId
        }).catch(error => {
            console.error('createRunResult: ', error);
        });
    }
    // R(): Pulls all runresults (only!) by scenarioresult Id; Resultdetails
    readAllRunResultsByScenarioResultId (scenarioResultId: number) {
        return fromPromise(Runresult.findAll({
            raw: true,
            where: {
                id: scenarioResultId
            }
        }));
    }

    // RUNRESULTDATA
    // C(): Creates a runresultdata; Running
    createRunDetail (relativeTime: Time, key: string, value: string, runResultId: number) {
        Rundetail.create({
            relativeTime: relativeTime,
            key: key,
            value: value,
            runResultId: runResultId
        }).catch(error => {
            console.error('createRunDetail: ', error);
        });
    }
    // C(): Creates a bulk of runresultdata; Running
    createRunDetailBulk (runDetails: object[]) {
        Rundetail.bulkCreate(runDetails).catch(error => {
            console.error('createRunDetailBulk: ', error);
        });
    }
    // R(): Pulls all runresultsdata(only!) by runresult Id; Resultdetails
    readAllRunDetailsByRunResultId (runResultId: number) {
        return fromPromise(Rundetail.findAll({
            raw: true,
            where: {
                id: runResultId
            }
        }));
    }

    // Testmethods
    // C(): Creates results
    createDummyResultData () {
        Testsetresult.create({
            name: 'TR',
            Scenarioresult: {
                name: 'SR',
            }
        }, {
            include: Scenarioresult
        }).then(() => console.log('Worked'));
    }
    readTestsetResultById (testsetResultId: object) {
        return fromPromise(Testsetresult.findAll({
            attributes: ['id', 'name', 'startTimestamp', 'duration', 'testsetId'],
            raw: true,
            where: { id: testsetResultId },
        }));
        /*return fromPromise(Testsetresult.findOne({
            attributes: ['id', 'name', 'startTimestamp', 'duration', 'testsetId'],
            where: { id: testsetResultId },
            raw: true,
            include: [{
                model: Scenarioresult
            }]
        }));*/
    }
}


/* createTableInSuite() {/!*
   connection
       .authenticate()
       .then(() => {
           console.log('Connection has been established successfully.');
       })
       .catch(err => {
           console.error('Unable to connect to the database:', err);
       });

   const Olla = connection.define('ollams', {
       su_Name: Sequelize.STRING,
       su_Description: Sequelize.TEXT,
       su_isFinal: Sequelize.BOOLEAN
   });

   connection.sync().then(function ({}) {
       Olla.create({
           su_Name: 'hello',
           su_Description: 'ffdfd',
           su_isFinal: 1
       });
   });*!/*
   */
