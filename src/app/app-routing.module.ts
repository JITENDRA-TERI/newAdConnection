import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {
    path: 'landing/home/signup',
    component: HomeComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [MsalGuard]
  },
  {
    path: '',
    component: HomeComponent
  },
 
];

const isIframe = window !== window.parent && !window.opener; // Remove this line to use Angular Universal

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // Don't perform initial navigation in iframes
    //initialNavigation: !isIframe ? 'enabled' : 'disabled' // Remove this line to use Angular Universal
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
