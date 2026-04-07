import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimStringsPipe implements PipeTransform {
  transform(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => this.transform(item));
    }

    if (value && typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>);
      return Object.fromEntries(
        entries.map(([key, item]) => [key, this.transform(item)]),
      );
    }

    if (typeof value === 'string') {
      return value.trim();
    }

    return value;
  }
}
