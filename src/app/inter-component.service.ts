import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InterComponentService {
  private adminPassword: string;
  private createTestsetName: string;
  private runTestsetId: number;
  constructor() {
    this.adminPassword = '';
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
}
