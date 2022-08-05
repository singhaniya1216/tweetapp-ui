import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'setSize'
})
export class SetSizePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return value.length;
  }

}
