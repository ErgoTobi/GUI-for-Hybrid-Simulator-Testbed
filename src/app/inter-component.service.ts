import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InterComponentService {
  private adminPassword: string;
  private automaticNavigation: boolean;
  private databaseConnected: boolean;
  private createTestsetName: string;
  private runTestsetId: number;
  constructor() {
    this.adminPassword = '';
    this.automaticNavigation = true;
  }

  setCreateTestsetName(testsetName: string) {
    this.createTestsetName = testsetName;
  }
  getCreateTestsetName() {
    return this.createTestsetName;
  }

  setRunTestsetId(testsetId: number) {
      this.runTestsetId = testsetId;
  }
  getRunTestsetId() {
      return this.runTestsetId;
  }

  setAdminPassword(adminPassword: string) {
      this.adminPassword = adminPassword;
  }
  getAdminPassword() {
      return this.adminPassword;
  }

  getAutomaticNavigation(): boolean {
      return this.automaticNavigation;
  }

  setAutomaticNavigation(value: boolean) {
      this.automaticNavigation = value;
  }
  getDatabaseConnected(): boolean {
      return this.databaseConnected;
  }

  setDatabaseConnected(value: boolean) {
      this.databaseConnected = value;
  }
}
