import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'

const routes: Routes = [
  { path: '', redirectTo: '/subscriptions', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('~/app/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'gallery',
    loadChildren: () => import('~/app/gallery/gallery.module').then((m) => m.GalleryModule),
  },
  {
    path: 'videos',
    loadChildren: () => import('~/app/videos/videos.module').then((m) => m.VideosModule),
  },
  {
    path: 'music',
    loadChildren: () => import('~/app/music/music.module').then((m) => m.MusicModule),
  },
  {
    path: 'bank',
    loadChildren: () => import('~/app/bank/bank.module').then((m) => m.BankModule),
  },
  {
    path: 'subscriptions',
    loadChildren: () => import('~/app/subscriptions/subscriptions.module').then((m) => m.SubscriptionsModule),
  },
  {
    path: 'food',
    loadChildren: () => import('~/app/food/food.module').then((m) => m.FoodModule),
  },
  {
    path: 'settings',
    loadChildren: () => import('~/app/settings/settings.module').then((m) => m.SettingsModule),
  },
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
