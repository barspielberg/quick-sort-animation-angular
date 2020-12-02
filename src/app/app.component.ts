import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component } from '@angular/core';
import { ItemModel } from './item.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('swapItem', [
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate(
          '200ms ease-out',
          style({ transform: 'translateY(-50px)', opacity: 0 })
        ),
      ]),
      transition(':enter', [
        style({ transform: 'translateY(-50px)', opacity: 0 }),
        animate(
          '200ms ease-in',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
      state(
        'notActive',
        style({ transform: 'translateY(0)', boxShadow: 'none' })
      ),
      state(
        'active',
        style({
          transform: 'translateY(-20px)',
          boxShadow: '0 3px 6px black',
        })
      ),
      transition('notActive<=>active', animate('500ms ease')),
    ]),
  ],
})
export class AppComponent {
  numList: Array<ItemModel> = [];
  btnDisabled = false;

  constructor() {
    this.newNumbers();
  }

  async newNumbers() {
    while (this.numList.length > 0) {
      this.numList.splice(0, 1);
      await this.wait(40);
    }
    for (let i = 0; i < 15; i++) {
      this.numList[i] = new ItemModel(Math.round(Math.random() * 20));
      await this.wait(40);
    }
  }

  async sort() {
    this.numList.forEach((i) => (i.isDone = false));
    this.btnDisabled = true;
    await this.sortDivision(this.numList, 0, this.numList.length - 1);
    this.btnDisabled = false;
  }

  async sortDivision(arr: Array<ItemModel>, start: number, end: number) {
    for (let i = start; i <= end; i++) {
      this.numList[i].isActive = true;
    }
    await this.wait(500);

    if (start >= end) {
      if (arr[start]) {
        arr[start].isActive = false;
        arr[start].isDone = true;
      }
      return;
    }

    const p = await this.divide(this.numList, start, end);

    arr[p].isDone = true;
    for (let i = start; i <= end; i++) {
      this.numList[i].isActive = false;
    }
    await this.wait(500);

    await this.sortDivision(arr, start, p - 1);
    await this.sortDivision(arr, p + 1, end);
  }

  async divide(arr: Array<ItemModel>, start: number, end: number) {
    let pivotIndex = Math.round((end + start) / 2);

    const p = arr[pivotIndex].value;
    arr[pivotIndex].isPivot = true;

    let i = start;
    let j = end;
    arr[i].isCheck = true;
    arr[j].isCheck = true;

    while (i < j) {
      while (arr[i].value < p && i < pivotIndex) {
        await this.wait(300);
        arr[i].isCheck = false;
        i++;
        arr[i].isCheck = true;
      }
      await this.wait(300);
      while (arr[j].value > p && j > pivotIndex) {
        await this.wait(300);
        arr[j].isCheck = false;
        j--;
        arr[j].isCheck = true;
      }
      await this.wait(300);
      if (i < j) {
        if (arr[i].value == arr[j].value) {
          await this.wait(300);
          if (i < pivotIndex) {
            arr[i].isCheck = false;
            i++;
            arr[i].isCheck = true;
          } else {
            arr[j].isCheck = false;
            j--;
            arr[j].isCheck = true;
          }
        } else {
          await this.swap(i, j);
          if (i == pivotIndex) pivotIndex = j;
          else if (j == pivotIndex) pivotIndex = i;
        }
      }
    }
    arr[j].isCheck = false;
    arr[pivotIndex].isPivot = false;
    return pivotIndex;
  }

  async swap(i: number, j: number) {
    if (i > j) {
      const temp = i;
      i = j;
      j = temp;
    }

    const itemI = this.numList[i];
    const itemJ = this.numList[j];

    this.numList.splice(j, 1);
    this.numList.splice(i, 1);

    await this.wait(210);

    this.numList.splice(i, 0, itemJ);
    this.numList.splice(j, 0, itemI);

    await this.wait(300);
  }

  wait(milisec: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, milisec);
    });
  }
}
