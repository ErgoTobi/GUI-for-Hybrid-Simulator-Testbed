import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './components/create/create.component';
import {ResultoverviewComponent} from './components/resultoverview/resultoverview.component';
import {ResultComponent} from './components/result/result.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'create',
        component: CreateComponent
    },
    {
        path: 'result/:id',
        component: ResultComponent
    },
    {
        path: 'resultOverview',
        component: ResultoverviewComponent
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
