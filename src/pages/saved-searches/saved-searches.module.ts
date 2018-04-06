import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SavedSearchesPage } from './saved-searches';

@NgModule({
  declarations: [
    SavedSearchesPage,
  ],
  imports: [
    IonicPageModule.forChild(SavedSearchesPage),
  ],
})
export class SavedSearchesPageModule {}
