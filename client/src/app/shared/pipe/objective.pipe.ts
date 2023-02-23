import { Pipe, PipeTransform } from '@angular/core';
import { objectives } from 'src/app/@constants';

@Pipe({
  name: 'objective',
})
export class ObjectivePipe implements PipeTransform {
  transform(objectiveId): string {
    console.log(parseInt(objectiveId));
    if (objectiveId) {
      return objectives.find((e) => e.id === parseInt(objectiveId)).name;
    }
  }
}
