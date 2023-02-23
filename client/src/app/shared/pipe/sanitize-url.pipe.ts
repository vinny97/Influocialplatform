import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Pipe({
  name: 'sanitizeUrl',
})
export class SanitizeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: any, args?: any): any {
    let URL = url.replace(/\s/g, '');
    console.log(URL);
    console.log(this.sanitizer.bypassSecurityTrustStyle('url(' + URL + ')'));
    return this.sanitizer.bypassSecurityTrustStyle('url(' + URL + ')');
  }
}
