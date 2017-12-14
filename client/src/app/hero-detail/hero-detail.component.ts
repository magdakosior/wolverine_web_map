import { Component, OnInit, Input, OnChanges} from '@angular/core';
import { Hero } from '../hero';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { HeroService }  from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit, OnChanges {


  @Input() hero: Hero;
  @Input('passItemId') itemId: number;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  ngOnInit(): void {
    //console.log('in hero-detail component: ngOnInit()');
    //this.getHero();
    //console.log(JSON.stringify(this.hero));
    //this.hero = this.hero[0];
  }

  ngOnChanges(changes: any) { //changes: {[itemId: number]: SimpleChanges}){
    //console.log('in hero-detail component: ngOnChanges()');
    //console.log(changes.prop);
    //make request and get the matching data and bind to 
    //this.searchedResults =  //data coming from the service resul()
    //this.getHero();
    this.hero = this.hero[0];
  }
  /*
  getHero(): void {
    //console.log('in hero-detail component: getHero()');
    //const id = +this.route.snapshot.paramMap.get('id');//The JavaScript (+) operator converts the string to a number, which is what a hero id should be.
    this.heroService.getHero(this.itemId)
      .subscribe(hero => this.hero = hero);
  }
*/
  goBack(): void {
    this.location.back();
  }

  save(): void {
     this.heroService.updateHero(this.hero)
       .subscribe(() => this.goBack());
   }
}
