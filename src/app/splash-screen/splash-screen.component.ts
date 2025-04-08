import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-splash-screen',
  template: `
    <ion-content class="splash-screen">
      <div class="splash-container">
        <div class="logo-container">
          <img src="assets/icon/icon.png" alt="Snackify Logo">
        </div>
        <h1>Snackify</h1>
        <p>Delicious snacks delivered!</p>
        <div class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .splash-screen {
      --background: #FF4B4B;
    }
    .splash-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      text-align: center;
    }
    .logo-container {
      width: 150px;
      height: 150px;
      margin-bottom: 20px;
      animation: bounce 1s infinite;
    }
    .logo-container img {
      width: 100%;
      height: 100%;
    }
    h1 {
      font-size: 2.5em;
      margin: 10px 0;
    }
    p {
      font-size: 1.2em;
      opacity: 0.9;
    }
    .loading-dots {
      margin-top: 30px;
    }
    .loading-dots span {
      display: inline-block;
      width: 10px;
      height: 10px;
      margin: 0 5px;
      background: white;
      border-radius: 50%;
      animation: dots 1.4s infinite;
    }
    .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
    .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes dots {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.5); }
    }
  `]
})
export class SplashScreenComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    // Hide the splash screen after 3 seconds
    setTimeout(() => {
      // Navigate to your main page
      this.router.navigate(['/home']);
    }, 3000);
  }
}