import { Injectable } from '@angular/core';
import {fromPromise} from 'rxjs/internal-compatibility';


const Sequelize = require('sequelize');
const connection = new Sequelize('application_testing_suite', 'root', 'password', {
    dialect: 'mysql'
});
const Runresult = require('./models/runresult')(connection, Sequelize);
const Scenario = require('./models/scenario')(connection, Sequelize);
const Scenarioresult = require('./models/scenarioresult')(connection, Sequelize);
const Setting = require('./models/setting')(connection, Sequelize);
const Suite = require('./models/suite')(connection, Sequelize);
const Testset = require('./models/testset')(connection, Sequelize);
const Testsetresult = require('./models/testsetresult')(connection, Sequelize);
const Promise = require('promise');


@Injectable({
  providedIn: 'root'
})

export class DataService {

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

    updateSetting() {
        connection
            .authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            }).then(function () {
            Setting.create({
                id: 2,
                ecu_amount: 1
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


    readAllTestsetResult() {
       return fromPromise(Testsetresult.findAll({
                    attributes: ['id', 'name', 'startTimestamp', 'duration', 'Testset_id'],
                    raw: true,
       }));
        // return connection
        //     .authenticate()
        //     .then(() => {
        //         console.log('Connection has been established successfully.');
        //     })
        //     .catch(err => {
        //         console.error('Unable to connect to the database:', err);
        //     }).then(function () {
        //     Testsetresult.findAll({
        //         attributes: ['id', 'name', 'startTimestamp', 'duration', 'Testset_id'],
        //         raw: true,
        //     }).then(function (data) {
        //         console.log(data);
        //     }).catch(error => {
        //     });
        // });
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
