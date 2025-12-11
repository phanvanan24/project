import { Component, ElementRef, input, effect, viewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tikz-viewer',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="tikz-wrapper flex justify-center my-4 bg-white p-2 rounded border border-gray-100 overflow-x-auto">
       <div #container></div>
    </div>
  `
})
export class TikzViewerComponent {
  code = input.required<string>();
  container = viewChild<ElementRef>('container');

  constructor() {
    effect(() => {
      const tikzCode = this.code();
      const el = this.container()?.nativeElement;
      
      if (el && tikzCode) {
        // Clear previous
        el.innerHTML = '';
        
        // Inject script tag for TikZJax to process
        // TikZJax watches the DOM for <script type="text/tikz">
        const script = document.createElement('script');
        script.type = 'text/tikz';
        script.textContent = tikzCode;
        el.appendChild(script);
      }
    });
  }
}