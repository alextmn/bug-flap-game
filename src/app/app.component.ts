import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BugGameComponent } from './bug-game/bug-game.component';
import { HandLandmarkerComponent } from './hand-landmarker/hand-landmarker.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BugGameComponent, HandLandmarkerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'bug-flap-game';
}
