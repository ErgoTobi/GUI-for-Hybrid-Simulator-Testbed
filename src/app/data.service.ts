import { Injectable } from '@angular/core';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Time} from '@angular/common';
import {from, Timestamp} from 'rxjs';
import {forEach} from '@angular/router/src/utils/collection';


const Sequelize = require('sequelize');
const connection = new Sequelize('application_testing_suite', 'root', 'password', {
    dialect: 'mysql'
});
const Rundetail = require('./models').rundetail;
const Runresult = require('./models/runresult')(connection, Sequelize);
const Scenario = require('./models/scenario')(connection, Sequelize);
const Scenarioresult = require('./models/scenarioresult')(connection, Sequelize);
const Setting = require('./models/setting')(connection, Sequelize);
const Suite = require('./models/suite')(connection, Sequelize);
const Testset = require('./models/testset')(connection, Sequelize);
const Testsetresult = require('./models/testsetresult')(connection, Sequelize);
const Promise = require('promise');

Scenario.associate = function (models) {
    Scenario.belongsTo(Testset, {
        onDelete: 'CASCADE',
    });
};

Testset.associate = function(models) {
   Testset.hasMany(Scenario);
};


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

    /*SETTING*/
    // R: Pulls a setting where the Suite_id equals SpeedDreams; Overview
    readSetting (id: number) {
        return from(Setting.findById(id)({
            attributes: ['id', 'ecuAmount'],
            raw: true,
        }));
    }
    // U: ECU update
    updateSetting(ecuAmount: number) {
        connection
            .authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            }).then(function () {
            Setting.create({
                ecu_amount: ecuAmount
            }).catch(error => {
            });
        });
    }

    /*TESTSET*/
    // C: Creates a testset; Create -> Overview
    createTestset (name: String, suiteId: number) {
        connection
            .authenticate()
            .then(() => {
                console.log('Connection createTestset has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database with createTestset:', err);
            }).then(function () {
            Testset.create({
                name: name,
                Suite_id: suiteId
            }).catch(error => {
                console.error('createTestset:', error);
            });
        });
    }
    // R(w): Pulls all testsets (incl. scenario data) where the Suite_id equals SpeedDreams; Overview
    readAllTestsets () {
        return fromPromise(Testset.findAll({
            attributes: ['id', 'name', 'Suite_id'],
            raw: true,
        }));
    }
    // R(w): Pulls a testset (incl. scenario data) by id that the method gets from onclick event; Overview -> Running
    readTestsetById (testsetId: number) {
        return fromPromise(Testset.findOne({
            attributes: ['id', 'name', 'Suite_id'],
            where: { id: testsetId },
            raw: true,
            include: [{
                model: Scenario,
                where: { Testset_id: Sequelize.col('testset.id') }
            }]
        }));
    }
    // D: Deletes a testset (incl. cascading deletion of cohesive data) by id that the method gets from on onclick event; Overview
    deleteTestsetById (testsetId: number) {
        Testsetresult.findAll({
            attributes: ['id'],
            raw: true,
            where: {
                Testset_id: testsetId
            }
        }).then(data => {
            console.log(data);
            data.forEach(function (value) {
                // start deleteTestsetResultById(value.id)
                Scenarioresult.findAll({
                    attributes: ['id'],
                    raw: true,
                    where: {
                        TestsetResult_id: value.id
                    }
                }).then(function (data2) {
                    console.log(data2);
                    data.forEach(function (value2) {
                        Runresult.destroy({
                            where: {
                                ScenarioResult_id: value2.id
                            }});
                    });
                }).then(() => {
                    Scenarioresult.destroy({
                        where: {
                            TestsetResult_id: value.id
                        }
                    });
                }).then(() => {
                    Testsetresult.destroy({
                        where: {
                            id: value.id
                        }
                    });
                });
                // end deleteTestsetResultById(value.id)
            });
        }).then(() => {
            Scenario.destroy({
                where: {
                    Testset_id: testsetId
                }
            });
        }).then(() => {
            Testset.destroy({
                where: {
                    id: testsetId
                }
            });
        });
    }

    /*SCENARIO*/
    // C: Creates a scenario; Create
    createScenario (name: String, mode: String, route: String, runQuantity: number, isTextOnly: Boolean, testsetId: number) {
        connection
            .authenticate()
            .then(() => {
                console.log('Connection createScenario has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database with createScenario:', err);
            }).then(function () {
            Scenario.create({
                name: name,
                mode: mode,
                route: route,
                runQuantity: runQuantity,
                isTextOnly: (isTextOnly === true) ? (1) : (0),
                Testset_id: testsetId
            }).catch(error => {
                console.error('createScenario:', error);
            });
        });
    }

    /*TESTSETRESULT*/
    // C: Creates a testsetresult; Running -> Overview
    createTestsetResult (name: String, startTimestamp: Timestamp<any>, duration: Time, testsetId: number) {
        connection
            .authenticate()
            .then(() => {
                console.log('Connection createTestsetResult has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database with createTestsetResult:', err);
            }).then(function () {
            Scenario.create({
                name: name,
                startTimestamp: startTimestamp,
                duration: duration,
                Testset_id: testsetId
            }).catch(error => {
                console.error('createTestsetResult:', error);
            });
        });
    }
    // R: Pulls all testsetsresults (only!); Resultoverview
    readAllTestsetResultsOnly () {
        return fromPromise(Testsetresult.findAll({
            attributes: ['id', 'name', 'startTimestamp', 'duration', 'Testset_id'],
            raw: true,
        }));
    }
    // D: Deletes a testset (incl. cascading deletion of cohesive data) by id that the method gets from on onclick event; Overview
    deleteTestsetResultById (testsetresultId: number) {
        Scenarioresult.findAll({
            attributes: ['id'],
            raw: true,
            where: {
                TestsetResult_id: testsetresultId
            }
        }).then(function (data) {
            console.log(data);
            data.forEach(function (value) {
                Runresult.destroy({
                    where: {
                        ScenarioResult_id: value.id
                    }});
            });
        }).then(() => {
            Scenarioresult.destroy({
                where: {
                    TestsetResult_id: testsetresultId
                }
            });
        }).then(() => {
            Testsetresult.destroy({
                where: {
                    id: testsetresultId
                }
            });
        });
    }

    /*SCENARIORESULT*/
    // C: Creates a scenarioresult; Running
    createScenarioResult (name: String, startTimestamp: Timestamp<any>, duration: Time, scenarioId: number, testsetresultId: number) {
        connection
            .authenticate()
            .then(() => {
                console.log('Connection createScenarioResult has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database with createScenarioResult:', err);
            }).then(function () {
            Scenario.create({
                name: name,
                startTimestamp: startTimestamp,
                duration: duration,
                Scenario_id: scenarioId,
                TestsetResult_id: testsetresultId
            }).catch(error => {
                console.error('createScenarioResult:', error);
            });
        });
    }
    // R: Pulls all scenarioresults (only!) by testsetresult Id; Resultdetails
    readAllScenarioResultsByTestsetResultId (testsetResultId: number) {
        // let eventId = event.currentTarget;
        return fromPromise(Scenarioresult.findAll({
            attributes: ['id', 'name', 'startTimestamp', 'duration', 'Scenario_id', 'TestsetResult_id'],
            raw: true,
            where: {
                id: testsetResultId
            }
        }));
    }

    /*RUNRESULT*/
    // C: Creates a runresult; Running
    createRunResult (startTimestamp: Timestamp<any>, duration: Time, state: String, scenarioresultId: number) {
        connection
            .authenticate()
            .then(() => {
                console.log('Connection createRunResult has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database with createRunResult:', err);
            }).then(function () {
            Runresult.create({
                startTimestamp: startTimestamp, // To add to database
                duration: duration,
                state: state,
                ScenarioResult_id: scenarioresultId
            }).catch(error => {
                console.error('createRunResult:', error);
            });
        });
    }
    // R: Pulls all runresults (only!) by scenarioresult Id; Resultdetails
    readAllRunResultsByScenarioResultId (scenarioResultId: number) {
        return fromPromise(Runresult.findAll({
            attributes: ['id', 'duration', 'state', 'ScenarioResult_id'],
            raw: true,
            where: {
                id: scenarioResultId
            }
        }));
    }

    /*RUNRESULTDATA*/
    // C: Creates a runresultdata; Running
    createRunResultData () {
        connection
            .authenticate()
            .then(() => {
                console.log('Connection createScenario has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database with createScenario:', err);
            }).then(function () {
            Rundetail.create({
                id: 100
            }).catch(error => {
                console.error('createScenario:', error);
            });
        });
    }
    // R: Pulls all runresultsdata(only!) by runresult Id; Resultdetails
    readAllRunResultDataByRunResultId () {}

    /* Methods to test
    * the data Service
    * Yeah! */
    updateSuite(name: String, description: String, isReady: Boolean) {
        connection
            .authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            }).then(function () {
            Suite.create({
                name: name,
                description: description,
                isReady: (isReady === true) ? (1) : (0),
                Setting_id: 1 // Change for different Setting; necessary
            }).catch(error => {
            });
        });
    }

    readTestsetresult(Id: number) {
        return connection
            .authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            }).then(function () {
            Testsetresult.findAll({
                attributes: ['id', 'name', 'startTimestamp', 'duration', 'Testset_id'],
                raw: true,
                where: {
                    id: Id
                }
            }).pipe(function (data) {
                console.log(data);
                return this.data;
            }).catch(error => {
            });
        });
        // console.log('extracted data');
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
