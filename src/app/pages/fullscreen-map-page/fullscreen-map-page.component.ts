import { AfterViewInit, Component, ElementRef, viewChild } from '@angular/core';

import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment.development';

mapboxgl.accessToken = environment.mapboxToken;

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [],
  templateUrl: './fullscreen-map-page.component.html',
  styles: [`
    div {
      height: calc(100vh - 64px);
      width: 100vw;
    }
  `]
})
export class FullscreenMapPageComponent implements AfterViewInit {

  divElement = viewChild<ElementRef<HTMLDivElement>>('map');

  async ngAfterViewInit(): Promise<void> {


    if (!this.divElement) throw new Error('No se encontró el elemento HTML');

    const element = this.divElement()!.nativeElement;
    if (!element) throw new Error('No se encontró el elemento HTML');

    await new Promise( resolve => setTimeout( resolve, 80 ) );

    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });

  }

}
