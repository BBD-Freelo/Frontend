import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
console.log(process.env["sdfjsd"])
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
