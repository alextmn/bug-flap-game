import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { RetryConfig } from 'rxjs';

@Component({
  selector: 'app-glow-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './glow-button.component.html',
  styleUrl: './glow-button.component.css'
})
export class GlowButtonComponent implements OnInit {
  @Output() onClick: EventEmitter<string> = new EventEmitter();
  @Input() text: string = "Click Me!" ;  // Declare an input property
  
  @ViewChild('glowbutton') widget!: ElementRef<HTMLElement>;
  isHover = false;
  clicking = false;
  constructor() {} 
  
  
  ngOnInit(): void {

  }

  
  public track(x: number, y: number, isClicking: boolean) {
    
    this.isHover = this.inRect(x,y)
    if (this.isHover && isClicking) {
      this.clicking = true;
    } 

    if (!this.isHover) {
      if (this.clicking && !isClicking) {
        this.handleClick();
      }
      this.clicking = false;
      
    }
  }
  handleClick() {
    this.onClick.emit("click event")
  }

  private inRect(px: number, py: number): boolean {
    px = (1 - px) * 640;
    py = py * 480;
    const br =  this.widget.nativeElement.getBoundingClientRect();
    const top =  parseInt(this.widget.nativeElement.style.top,10); // 100px -> 100
    const left = parseInt(this.widget.nativeElement.style.left,10);

    const rect:any = {x:left, y:top, width: br.width, height: br.height};
    
    return (
      px >= rect.x &&            // Check if x is to the right of the left edge
      px <= rect.x + rect.width && // Check if x is to the left of the right edge
      py >= rect.y &&            // Check if y is below the top edge
      py <= rect.y + rect.height   // Check if y is above the bottom edge
    );
  }
}
