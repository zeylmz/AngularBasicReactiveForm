import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'personal',
    loadChildren: () =>
      import('../modules/personal/personal.module').then((m) => m.PersonalModule),
  },
  {
    path: '',
    redirectTo: '/personal',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'personal',
  },
];

export { Routing };

