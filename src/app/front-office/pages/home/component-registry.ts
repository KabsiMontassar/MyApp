import { Type } from '@angular/core';
import { HeaderwithiconsComponent } from './plateformeComps/heros/headerwithicons/headerwithicons.component';
import { CenteredheroComponent } from './plateformeComps/heros/centeredhero/centeredhero.component';
import { HerowithimageComponent } from './plateformeComps/heros/herowithimage/herowithimage.component';
import { VerticallycenteredheroComponent } from './plateformeComps/heros/verticallycenteredhero/verticallycenteredhero.component';
import { ColumnswithiconsComponent } from './plateformeComps/features/columnswithicons/columnswithicons.component';
import { CustomcardsComponent } from './plateformeComps/features/customcards/customcards.component';
import { HeadingsComponent } from './plateformeComps/others/headings/headings.component';
import { HeadingleftwithimageComponent } from './plateformeComps/others/headingleftwithimage/headingleftwithimage.component';
import { HeadingrightwithimageComponent } from './plateformeComps/others/headingrightwithimage/headingrightwithimage.component';
import { NewsletterComponent } from './plateformeComps/others/newsletter/newsletter.component';
import { plateformeaboutComponent } from './plateformeComps/others/about/about.component';

export const ComponentRegistry: { [key: string]: Type<any> } = {
  headerwithicons: HeaderwithiconsComponent,
  centeredhero: CenteredheroComponent,
  herowithimage: HerowithimageComponent,
  verticallycenteredhero: VerticallycenteredheroComponent,
  columnswithicons: ColumnswithiconsComponent,
  customcards: CustomcardsComponent,
  headings: HeadingsComponent,
  headingleftwithimage: HeadingleftwithimageComponent,
  headingrightwithimage: HeadingrightwithimageComponent,
  newsletter: NewsletterComponent,
  plateformeabout: plateformeaboutComponent,
};
