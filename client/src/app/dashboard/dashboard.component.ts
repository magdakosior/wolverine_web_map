import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MapComponent } from "../map/map.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.getHeroes();
  }

  markerClick(message: string) {
    console.log('Current marker click ' + message);
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe((heroes: Hero[]) => {

            // do stuff with our data here.
            //console.log(heroes);
            // asign data to our class property in the end
            // so it will be available to our template
            this.heroes = heroes //= heroes.slice(1, 5)
        })

    //this.heroService.getHeroes()
      //.subscribe(heroes => this.heroes = heroes.slice(1, 5));
  }
}