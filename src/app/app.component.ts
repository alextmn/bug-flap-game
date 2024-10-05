import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HandLandmarkerComponent } from './hand-landmarker/hand-landmarker.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,  HandLandmarkerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'bug-flap-game';
}
