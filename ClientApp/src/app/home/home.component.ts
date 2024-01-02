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

  constructor(
    private http: HttpClient,
    @Inject("BASE_URL") private baseUrl: string
  ) {
    this.get("");
  }

  get(searchTerm: string) {
    console.log("**************" + this.baseUrl)
    this.http
      .get<HackerNewsStory[]>(
        `${this.baseUrl}hackernews?searchTerm=${searchTerm}`
      )
      .pipe(
        tap(result => {
          this.hackerNewsStories = result;
        }),
        catchError(error => {
          if (error.status === 404) {
            console.error('Resource not found:', error);
          } else {
            console.error('An error occurred:', error);
          }
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
