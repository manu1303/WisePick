import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>🔥 WisePick conectado a Firestore</h1>
    <p>Documentos en la colección "test":</p>
    <ul>
      <li *ngFor="let item of items$ | async">
        {{ item | json }}
      </li>
    </ul>
  `,
})
export class AppComponent {
  private firestore = inject(Firestore);
  items$: Observable<any[]>;

  constructor() {
    const testCollection = collection(this.firestore, 'test');
    this.items$ = collectionData(testCollection, { idField: 'id' });
  }
}
