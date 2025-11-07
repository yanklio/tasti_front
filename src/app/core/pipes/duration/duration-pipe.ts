import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(value: string): string {
    const parts = value.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds >= 3600) {
      const totalHours = totalSeconds / 3600;
      const isInteger = totalHours % 1 === 0;
      const unit = totalHours === 1 ? 'hr' : 'hrs';
      return isInteger ? `${totalHours} ${unit}` : `${totalHours.toFixed(1)} ${unit}`;
    } else if (totalSeconds >= 60) {
      const totalMinutes = totalSeconds / 60;
      const isInteger = totalMinutes % 1 === 0;
      const unit = totalMinutes === 1 ? 'min' : 'mins';
      return isInteger ? `${totalMinutes} ${unit}` : `${totalMinutes.toFixed(1)} ${unit}`;
    } else {
      const unit = totalSeconds === 1 ? 'sec' : 'secs';
      return `${totalSeconds} ${unit}`;
    }
  }
}
