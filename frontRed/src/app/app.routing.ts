import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//importamos los componentes creados
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';

const appRoutes : Routes = [
    {path: '', component: LoginComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'home', component: HomeComponent},
    {path: 'user-edit', component: UserEditComponent},
    {path: 'gente', component: UsersComponent},
    {path: '**', component: HomeComponent},
];

export const appRoutingProviders : any[]=[];
export const routing : ModuleWithProviders = RouterModule.forRoot(appRoutes)