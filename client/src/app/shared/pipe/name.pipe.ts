import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'name'
})
export class NamePipe implements PipeTransform {

  transform(user: any): string {
    return user?.firstName +' '+ user?.lastName;
  }

}
