import { environment } from './../environments/environment';
import { PipeTransform, Pipe } from '@angular/core';
const ICON_FILE = 'feather-sprite.svg';
// @ts-ignore
@Pipe({ name: 'iconpipe'})
export class IconPipe implements PipeTransform {
    constructor() { }

    transform(value: string): string {
      return environment.imagesPath + ICON_FILE + '#' + value;
    }
}