import { Injectable } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

@Pipe({
    name: 'filter'
})

export class FilterPipe implements PipeTransform {

  constructor() { }

    transform(items: any[], searchText: string): any[] {
        if(!items) return [];
        if(!searchText) return items;
        searchText = searchText.toLowerCase();
        return items.filter( it => {
            return it.toLowerCase().includes(searchText);
        });
    }
}
