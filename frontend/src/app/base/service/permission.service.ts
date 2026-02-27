import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private readonly _permissions = signal<Set<string>>(new Set());

  readonly isLoaded = signal(false);

  setPermissions(slugs: string[]): void {
    this._permissions.set(new Set(slugs));
    this.isLoaded.set(true);
  }

  clear(): void {
    this._permissions.set(new Set());
    this.isLoaded.set(false);
  }

  has(slug: string): boolean {
    return this._permissions().has(slug);
  }

  hasAny(slugs: string[]): boolean {
    return slugs.some((s) => this._permissions().has(s));
  }

  hasAll(slugs: string[]): boolean {
    return slugs.every((s) => this._permissions().has(s));
  }
}
