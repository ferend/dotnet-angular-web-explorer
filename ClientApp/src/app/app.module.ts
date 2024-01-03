import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";
import { HomeComponent } from "./home/home.component";

import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NewsComponent } from "./news/news.component";

@NgModule({
  declarations: [AppComponent, NavMenuComponent, HomeComponent, NewsComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
    HttpClientModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    BrowserAnimationsModule,

    RouterModule.forRoot([
      { path: "", component: HomeComponent, pathMatch: "full" },
      { path: "NewsComponent", component: NewsComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
