import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InterComponentService {
  private createTestsetName: string;
  private runTestsetId: number;
  constructor() { }

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
}
