import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appNumItem]',
})
export class NumItemDirective implements OnInit {
  @Input() value: number;

  constructor(private el: ElementRef) {}
  ngOnInit() {
    this.el.nativeElement.style.backgroundColor = this.calcColor(
      0,
      20,
      this.value
    );
  }

  calcColor(min, max, val) {
    const minHue = 240,
      maxHue = 0;
    const curPercent = (val - min) / (max - min);
    const colString =
      'hsl(' + (curPercent * (maxHue - minHue) + minHue) + ',100%,70%)';
    return colString;
  }
}
