import { AfterViewInit, Component, effect, ElementRef, signal, viewChild } from '@angular/core';

import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment.development';
import { DecimalPipe, JsonPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapboxToken;

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [DecimalPipe, JsonPipe],
  templateUrl: './fullscreen-map-page.component.html',
  styles: [
    `
      div {
        height: calc(100vh - 64px);
        width: 100vw;
      }
      #controls {
        background-color: white;
        padding: 10px;
        border-radius: 5px;
        position: fixed;
        bottom: 15px;
        right: 10px;
        left: 10px;
        z-index: 9999;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        border: 1px solid #e2e8f0;
        max-width: 250px;
      }
      @media (min-width: 640px) {
        #controls {
          bottom: 25px;
          right: 20px;
          left: auto;
          width: 250px;
        }
      }
    `,
  ],
})
export class FullscreenMapPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef<HTMLDivElement>>('map');
  map = signal<mapboxgl.Map | null>(null);
  zoom = signal(14);
  coordinates = signal({ lng: -74.5, lat: 40 });
  zoomEffect = effect(() => {
    if (!this.map()) return;
    this.map()?.zoomTo(this.zoom());
  });

  async ngAfterViewInit(): Promise<void> {
    if (!this.divElement) throw new Error('No se encontró el elemento HTML');

    const element = this.divElement()!.nativeElement;
    if (!element) throw new Error('No se encontró el elemento HTML');

    const { lng, lat } = this.coordinates();

    await new Promise((resolve) => setTimeout(resolve, 80));

    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [lng, lat], // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
    });

    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {
    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      if (newZoom) this.zoom.set(newZoom);
    });

    map.on('moveend', (event) => {
      const target = event.target;
      const { lng, lat } = target.getCenter();
      this.coordinates.set({ lng, lat });
    });

    map.on('load,', () => {
      console.log('Mapa cargado');
    });

    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.ScaleControl());

    this.map.set(map);
  }
}
