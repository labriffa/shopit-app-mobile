import { Pipe } from '@angular/core';

@Pipe({name: 'fixed'})
export class FixedPipe {
  transform (input:number) {
    return input.toFixed(2);
  }
}