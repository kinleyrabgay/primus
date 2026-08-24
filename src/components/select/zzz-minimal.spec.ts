import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

@Component({
    standalone: true,
    imports: [CommonModule],
    template: `<p *ngFor="let item of items">{{ item }}</p>`
})
class MinimalComponent {
    items = [1, 2, 3];
}

describe('minimal ngFor', () => {
    it('works', () => {
        const fixture = TestBed.createComponent(MinimalComponent);
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toContain('1');
    });
});
