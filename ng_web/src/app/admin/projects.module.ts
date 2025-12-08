import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProjectGridComponent } from "./projects/project-grid.component";

const routes: Routes = [
  {
    path: '',
    component: ProjectGridComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ProjectGridComponent // Standalone component
  ],
  declarations: [], 
  exports: [ProjectGridComponent]
})
export class ProjectsModule {
  static entry = ProjectGridComponent;
}