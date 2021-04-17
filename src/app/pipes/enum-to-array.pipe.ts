import { Component } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { Hotspots } from '../enums/hotspots.enum'

@Pipe({
  name: 'enumToArray'
})
export class EnumToArrayPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
