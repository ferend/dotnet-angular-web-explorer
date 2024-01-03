import { Component, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { throwError } from "rxjs";
import { HackerNewsStory } from "./HackerNewsStory";

@Component({
  selector: "app-home",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.scss"]
})
export class NewsComponent {
  public hackerNewsStories: HackerNewsStory[] = [];
  public isSearchFieldEmpty: boolean = true; // Track whether the search field is empty

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.get('');
  }

  get(searchTerm: string) {
    if (!searchTerm) {
      console.warn('Search term is null or empty');
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
    const searchTerm = (event.target as HTMLTextAreaElement).value;
    this.isSearchFieldEmpty = searchTerm.trim() === ''; // Update the boolean based on the search field content
    this.get(searchTerm);
  }

  open(url: string) {
    window.open(url, "_blank");
  }
}

