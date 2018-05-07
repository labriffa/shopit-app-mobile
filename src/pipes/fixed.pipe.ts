import { Pipe } from '@angular/core';

@Pipe({name: 'fixed'})
export class FixedPipe {
  transform (input:number, fixed:number) {
    return input.toFixed(fixed);
  }
}