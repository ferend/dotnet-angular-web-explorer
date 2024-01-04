import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  weather: any;
  cityName: string = ''; // Add this property

  constructor() { }

  ngOnInit() {
    // Optionally, you can set a default city name here
    // this.cityName = 'Istanbul';
  }

  getWeather() {
    const apiKey = environment.apiKey;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${this.cityName}&appid=${apiKey}`;

    axios.get(apiUrl)
      .then(response => {
        this.weather = response.data;
      })
      .catch(error => {
        console.error('Error fetching weather:', error);
      });
  }

  // Add this method to your component
  getCurrentTime(): string {
    const currentTime = new Date();
    return currentTime.toLocaleTimeString();
  }
}
