import { Component, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { throwError } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent {

  public hackerNewsStories: HackerNewsStory[] = [];
  
  private http: HttpClient;
  private baseUrl: string;


  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = baseUrl;

    http.get<HackerNewsStory[]>(baseUrl +'hackernews?searchTerm=',
      {
        headers: {
          'Authorization': 'Bearer *token*',
          'Content-Type': 'application/x-www-form-urlencoded',
          'cache-control': 'no-cache'
        }
      }).pipe(tap(result => {
      this.hackerNewsStories = result;
    }, error => console.error(error)));
  }

  get(searchTerm: string) {
    // Check if searchTerm is null or empty
    if (!searchTerm) {
      // Optionally handle or log the case where searchTerm is null or empty
      console.warn('Search term is null or empty');
      // You can choose to return here or handle it according to your requirements
      return;
    }

    this.http
      .get<HackerNewsStory[]>(`${this.baseUrl}hackernews?searchTerm=${searchTerm}`, {
        headers: {
          'Authorization': 'Bearer *token*',
          'Content-Type': 'application/x-www-form-urlencoded',
          'cache-control': 'no-cache'
        }
      })
      .pipe(
        tap(result => {
          this.hackerNewsStories = result;
        }),
        catchError(error => {
          return throwError(error);
        })
      )
      .subscribe();
  }
  search(event: KeyboardEvent) {
    this.get((event.target as HTMLTextAreaElement).value);
  }

  open(url: string) {
    window.open(url, "_blank");
  }
}

interface HackerNewsStory {
  title: string;
  by: string;
  url: string;
}
