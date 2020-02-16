import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
      <app-nav-menu></app-nav-menu>
      <div class="container">
          <router-outlet></router-outlet>
      </div>`,
  styles: []
})
export class AppComponent {
  title = 'flowmemtorytool';
}
