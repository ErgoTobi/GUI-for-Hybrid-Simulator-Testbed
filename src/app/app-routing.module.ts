import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './components/create/create.component';
import {ResultoverviewComponent} from './components/resultoverview/resultoverview.component';
import {ResultComponent} from './components/result/result.component';
import {OverviewComponent} from './components/overview/overview.component';
import {OverviewDetailComponent} from './components/overview-detail/overview-detail.component';
import {RunComponent} from './components/run/run.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'overview/create',
        component: CreateComponent
    },
    {
        path: 'run',
        component: RunComponent
    },
    {
        path: 'result/:id',
        component: ResultComponent
    },
    {
        path: 'overview/resultOverview',
        component: ResultoverviewComponent
    },
    {
        path: 'overview',
        component: OverviewComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
