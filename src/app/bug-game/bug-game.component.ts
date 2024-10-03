import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-bug-game',
  templateUrl: './bug-game.component.html',
  styleUrls: ['./bug-game.component.css']
})
export class BugGameComponent implements OnInit {

  @ViewChild('gameCanvas', { static: true }) gameCanvas?: ElementRef<HTMLCanvasElement>;
  private ctx?: CanvasRenderingContext2D;
  
  bugs:any = [];
  bugRadius = 20;
  score = 0;
  bugImage?: HTMLImageElement;

  constructor() { }

  ngOnInit(): void {
    this.ctx = this.gameCanvas!!.nativeElement.getContext('2d')!!;
    this.loadBugImage();
    this.initializeGame();
  }

  loadBugImage() {
    this.bugImage = new Image();
    this.bugImage.src = 'assets/bug.png';  // Make sure the image is in the assets folder
    this.bugImage.onload = () => {
      console.log("Bug image loaded");
    };
  }

  initializeGame() {
    this.spawnBugs();
    this.animate();
  }

  // Create bugs at random positions
  spawnBugs() {
    for (let i = 0; i < 5; i++) {
      this.bugs.push({
        x: Math.random() * this.gameCanvas!!.nativeElement.width,
        y: Math.random() * this.gameCanvas!!.nativeElement.height,
        dx: (Math.random() - 0.5) * 4,
        dy: (Math.random() - 0.5) * 4,
        exploding: false,
        explosionTime: 0
      });
    }
  }

  // Update the game state
  animate() {
    requestAnimationFrame(() => this.animate());
    this.ctx!!.clearRect(0, 0, this.gameCanvas!!.nativeElement.width, this.gameCanvas!!.nativeElement.height);

    // Draw bugs and move them
    this.bugs = this.bugs.filter((bug: { exploding: any; explosionTime: number; x: number; y: number; dx: number; dy: number; }) => {
      if (bug.exploding) {
        // Animate explosion
        bug.explosionTime += 0.1;
        if (bug.explosionTime > 1) {
          return false; // Remove the bug after the explosion
        }
        this.drawExplosion(bug.x, bug.y, bug.explosionTime);
      } else {
        this.drawBug(bug.x, bug.y);
        bug.x += bug.dx;
        bug.y += bug.dy;

        // Bounce off the walls
        if (bug.x + this.bugRadius > this.gameCanvas!!.nativeElement.width || bug.x - this.bugRadius < 0) {
          bug.dx = -bug.dx;
        }
        if (bug.y + this.bugRadius > this.gameCanvas!!.nativeElement.height || bug.y - this.bugRadius < 0) {
          bug.dy = -bug.dy;
        }
      }
      return true; // Keep the bug in the array if it's not exploded yet
    });
  }

  // Draw a bug using the image
  drawBug(x: number, y: number) {
    if (this.bugImage) {
      this.ctx!!.drawImage(
        this.bugImage, 
        x - this.bugRadius, 
        y - this.bugRadius, 
        this.bugRadius * 2, 
        this.bugRadius * 2
      );
    }
  }

  // Draw explosion effect
  drawExplosion(x: number, y: number, explosionTime: number) {
    const scale = 1 + explosionTime; // Increase the size
    const alpha = 1 - explosionTime; // Fade the bug out

    this.ctx!!.save(); // Save current state of canvas
    this.ctx!!.globalAlpha = alpha; // Set transparency
    this.ctx!!.translate(x, y); // Move the bug to the correct position
    this.ctx!!.scale(scale, scale); // Scale up to create explosion effect

    if (this.bugImage) {
      this.ctx!!.drawImage(this.bugImage, -this.bugRadius, -this.bugRadius, this.bugRadius * 2, this.bugRadius * 2);
    }

    this.ctx!!.restore(); // Restore to original state
  }

  // Detect mouse click and see if it hits a bug
  @HostListener('click', ['$event'])
  onCanvasClick(event: MouseEvent) {
    const rect = this.gameCanvas!!.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    this.bugs.forEach((bug: { x: number; y: number; exploding: boolean; }) => {
      const distance = Math.sqrt((bug.x - mouseX) ** 2 + (bug.y - mouseY) ** 2);
      if (distance < this.bugRadius && !bug.exploding) {
        bug.exploding = true;  // Trigger explosion
        this.score++;
      }
    });
  }
}
