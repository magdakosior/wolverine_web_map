import { Component, OnInit} from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})

export class HeroesComponent implements OnInit {

  heroes: Hero[]; //heroes service to expose these heroes for binding

  //used Angular Dependency Injection to inject it into a component
  constructor(private heroService: HeroService) { }
  
  //The component's ngOnInit lifecycle hook calls the HeroService method, not the constructor.
  ngOnInit() {
    this.getHeroes();    
  }

  //gave the HeroService get data method an asynchronous signature.
  getHeroes(): void {

    this.heroService.getHeroes() //returns an Observable<Hero[]> so that we can return an asynchronous list of heroes
        .subscribe((heroes: Hero[]) => {

            // do stuff with our data here.
            console.log(heroes);
            // asign data to our class property in the end
            // so it will be available to our template
            this.heroes = heroes//.heroes
        })

          //heroes => this.heroes = heroes)
        console.log(this.heroes);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }
  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }
}
