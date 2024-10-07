import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FilesetResolver, HandLandmarker, DrawingUtils } from '@mediapipe/tasks-vision';
import { GlowButtonComponent } from '../glow-button/glow-button.component';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  imports: [GlowButtonComponent, CommonModule ],
  selector: 'app-hand-landmarker',
  templateUrl: './hand-landmarker.component.html',
  styleUrls: ['./hand-landmarker.component.css']
})
export class HandLandmarkerComponent implements OnInit {
  @ViewChild('videoElement', { static: true }) videoElement?: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: true }) canvasElement?: ElementRef<HTMLCanvasElement>;

  @ViewChild(GlowButtonComponent) childComponent?: GlowButtonComponent;

  private handLandmarker: any;
  private running: boolean = false;
  private isClicking = false;
  iAmReadyButtonEnabled = true;
  gameOverMessage = '';

  bugs:any = [];
  bugRadius = 20;
  bugImage?: HTMLImageElement;
  code5Bugs?: HTMLImageElement;
  hits = 0;
  caught = 0;

  constructor() { }

  async ngOnInit(): Promise<void> {
    this.loadBugImage();
    await this.initializeHandLandmarker();
  }

  iAmReady(b: boolean) {
    this.hits = 0;
    this.caught = 0;
    this.gameOverMessage = '';
    this.iAmReadyButtonEnabled = false;
    this.spawnBugs();
  }

  gameOver() {
    this.iAmReadyButtonEnabled = true
    const score = this.caught / this.hits;
    if (score > .8) this.gameOverMessage = 'You Are An Expert!';
    else if (score > .5) this.gameOverMessage = 'You Are A Senior Developer!';
    else if (score > .1) this.gameOverMessage = 'You Are A Junior Developer!';
    else this.gameOverMessage = 'You Are Not A Developer!';

  }

    // Create bugs at random positions
    spawnBugs() {
      for (let i = 0; i < 5; i++) {
        this.bugs.push({
          x: Math.random() * this.canvasElement!!.nativeElement.width,
          y: Math.random() * this.canvasElement!!.nativeElement.height,
          dx: (Math.random() - 0.5) * 4,
          dy: (Math.random() - 0.5) * 4,
          exploding: false,
          explosionTime: 0
        });
      }
    }
  loadBugImage() {
    this.bugImage = new Image();
    this.bugImage.src = 'assets/bug.png';  
    this.bugImage.onload = () => {
      console.log("Bug image loaded");
    };

    this.code5Bugs = new Image();
    this.code5Bugs.src = 'assets/code_5_bugs.png'; 
    this.code5Bugs.onload = () => {
      console.log("code image loaded");
    };
    
  }

  renderBugs(ctx:any) {
     // Draw bugs and move them
     this.bugs = this.bugs.filter((bug: { exploding: any; explosionTime: number; x: number; y: number; dx: number; dy: number; }) => {
      if (bug.exploding) {
        // Animate explosion
        bug.explosionTime += 0.1;
        if (bug.explosionTime > 1) {
          if (this.bugs.length === 1) {
            this.gameOver();
          }
          return false; // Remove the bug after the explosion
        }
        this.drawExplosion(ctx, bug.x, bug.y, bug.explosionTime);
      } else {
        this.drawBug(ctx, bug.x, bug.y);
        bug.x += bug.dx;
        bug.y += bug.dy;

        // Bounce off the walls
        if (bug.x + this.bugRadius > this.canvasElement!!.nativeElement.width || bug.x - this.bugRadius < 0) {
          bug.dx = -bug.dx;
        }
        if (bug.y + this.bugRadius > this.canvasElement!!.nativeElement.height || bug.y - this.bugRadius < 0) {
          bug.dy = -bug.dy;
        }
      }
      return true; // Keep the bug in the array if it's not exploded yet
    });
  }


    // Draw a bug using the image
    drawBug(ctx:any, x: number, y: number) {
      if (this.bugImage) {
        ctx.drawImage(
          this.bugImage, 
          x - this.bugRadius, 
          y - this.bugRadius, 
          this.bugRadius * 2, 
          this.bugRadius * 2
        );
      }
    }
  
    // Draw explosion effect
    drawExplosion(ctx:any, x: number, y: number, explosionTime: number) {
      const scale = 1 + explosionTime; // Increase the size
      const alpha = 1 - explosionTime; // Fade the bug out
  
      ctx.save(); // Save current state of canvas
      ctx.globalAlpha = alpha; // Set transparency
      ctx.translate(x, y); // Move the bug to the correct position
      ctx.scale(scale, scale); // Scale up to create explosion effect
  
      if (this.bugImage) {
        ctx.drawImage(this.bugImage, -this.bugRadius, -this.bugRadius, this.bugRadius * 2, this.bugRadius * 2);
      }
  
      ctx.restore(); // Restore to original state
  }

  async initializeHandLandmarker() {
    const vision = await FilesetResolver.forVisionTasks(
       "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    // Create the handLandmarker instance
    this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
        delegate: "GPU"
      },
      runningMode: 'VIDEO',
      numHands: 1
    });

    this.startWebcam();
  }

  startWebcam() {
    const video = this.videoElement!!.nativeElement;
    const canvas = this.canvasElement!!.nativeElement;
    const ctx = canvas.getContext('2d');

    // Start the video stream from webcam
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      video.srcObject = stream;
      video.play();

      video.onloadeddata = () => {
        this.running = true;
        this.processVideo();
      };
    });
  }

  processVideo() {
    const video = this.videoElement!!.nativeElement;
    const canvas = this.canvasElement!!.nativeElement;
    const ctx = canvas.getContext('2d')!!;
    

    const detectHands = async () => {
      if (!this.running) return;

      // Detect hands in the current video frame
      const results = await this.handLandmarker.detectForVideo(video, Date.now());

      // Clear the canvas before drawing new results
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      ctx.save();
      // Flip the canvas horizontally by scaling by -1 along the x-axis
      ctx.scale(-1, 1);
      ctx.drawImage(this.code5Bugs!!, -360, 300, 350, 150);
      ctx.restore();

      if (results.landmarks.length > 0) {
        for (const landmarks of results.landmarks) {
          this.detectClick(landmarks)
          const drawingUtils = new DrawingUtils(ctx); 
          drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 5
          });
          drawingUtils.drawLandmarks(landmarks, { color: "#FF0000", lineWidth: 1 }); 
        }
      }



      this.renderBugs(ctx)

      requestAnimationFrame(detectHands);
    };

    detectHands();
  }

  detectClick(landmarks:any) {
    // Landmark indices based on MediaPipe Hands:
    // 0: Wrist
    // 4: Thumb Tip
    // 8: Index Finger Tip
    // 9: Middle Finger MCP

    // Extract relevant landmarks
    const indexFingerTip = landmarks[8];
    const thumbTip = landmarks[4];
    const wrist = landmarks[0];
    const middleMCP = landmarks[9];

    // Calculate the Euclidean distance between index finger tip and thumb tip
    const distance = Math.sqrt(
        Math.pow(indexFingerTip.x - thumbTip.x, 2) +
        Math.pow(indexFingerTip.y - thumbTip.y, 2)
    );

    // Calculate the normalization factor (distance between wrist and middle finger MCP)
    const normalizationDistance = Math.sqrt(
        Math.pow(wrist.x - middleMCP.x, 2) +
        Math.pow(wrist.y - middleMCP.y, 2)
    );

    // Prevent division by zero
    const safeNormalizationDistance = normalizationDistance || 1;

    // Normalize the click distance
    const normalizedDistance = distance / safeNormalizationDistance;

    // Threshold for detecting "click" (adjust based on empirical testing)
    const clickThreshold = 0.3; // Example value

    if (normalizedDistance < clickThreshold) {
        if (!this.isClicking) {
            this.isClicking = true;
            this.handleClick(indexFingerTip.x, indexFingerTip.y);
        }
    } else {
        this.isClicking = false;
    }

    this.childComponent?.track(indexFingerTip.x, indexFingerTip.y, this.isClicking);
}

  handleClick(x:number, y: number) {
    if (this.iAmReadyButtonEnabled) return;
    this.hits++;
    const rect = this.canvasElement!!.nativeElement.getBoundingClientRect();
    x = x*rect.width;
    y = y*rect.height;
    //console.log(`Click detected! ${x}, ${y} ${this.bugs[0].x} ${this.bugs[0].y}`);
    // Simulate a click or trigger an action here
    // For example, you can simulate a mouse click on an element
    // or change something visually on the page.
    this.bugs.forEach((bug: { x: number; y: number; exploding: boolean; }) => {
      const distance = Math.sqrt((bug.x - x) ** 2 + (bug.y - y) ** 2);
      if (distance < this.bugRadius && !bug.exploding) {
        bug.exploding = true;  // Trigger explosion
        this.caught++;
      }
    });
  }
  ngOnDestroy() {
    this.running = false;
  }
}
