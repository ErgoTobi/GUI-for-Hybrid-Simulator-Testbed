import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './components/create/create.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'create',
        component: CreateComponent
    }
    {
        path: 'details/:id',
        component: ResultComponent
    },
    {
        path: 'resultOverview',
        component: Result-overviewComponent
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
