import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'joinNames' })
export class JoinNamesPipe implements PipeTransform {
    transform(items: readonly { name: string }[]): string {
        return items.map((item) => item.name).join(' · ');
    }
}