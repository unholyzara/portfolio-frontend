import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ordinal' })
export class OrdinalPipe implements PipeTransform {
    transform(index: number): string {
        return String(index + 1).padStart(2, '0');
    }
}