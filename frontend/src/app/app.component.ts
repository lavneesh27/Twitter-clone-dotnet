import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TwitterClone';
  user = sessionStorage.getItem('token') || localStorage.getItem('token');

  ngOnInit() {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      document.body.classList.add('dark-mode');
    }

    const savedColor = localStorage.getItem('defaultPrimaryColor');
    if (savedColor) {
      const { color, secColor } = JSON.parse(savedColor);
      document.documentElement.style.setProperty('--twitter-primary', color);
      document.documentElement.style.setProperty('--twitter-secondary', secColor);
    }
  }
}



