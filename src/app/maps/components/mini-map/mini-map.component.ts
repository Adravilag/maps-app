import { AfterViewInit, Component, ElementRef, input, output, signal, viewChild } from '@angular/core';
import mapboxgl, { Marker } from 'mapbox-gl';

@Component({
  selector: 'app-mini-map',
  imports: [],
  templateUrl: './mini-map.component.html',
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 260px;
        border-radius: 8px;
        overflow: hidden;
      }

      div {
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class MiniMapComponent implements AfterViewInit {

  divElement = viewChild<ElementRef<HTMLDivElement>>('map');
  map = signal<mapboxgl.Map | null>(null);
  markers = signal<Marker[]>([]);
  lngLat = input<{ lng: number; lat: number }>();
  color = input<string>();
  zoom = input<number>(14);

  async ngAfterViewInit(): Promise<void> {
    if (!this.divElement) throw new Error('No se encontró el elemento HTML');

    const element = this.divElement()!.nativeElement;
    if (!element) throw new Error('No se encontró el elemento HTML');

    await new Promise((resolve) => setTimeout(resolve, 80));

    const coordinates = this.lngLat();
    if (!coordinates) throw new Error('No se proporcionaron coordenadas');

    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [coordinates.lng, coordinates.lat], // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
      interactive: false, // deshabilita la interacción del usuario
      pitch: 30, // inclinación del mapa
    });

    const marker = new mapboxgl.Marker({ color: this.color() }).setLngLat([coordinates.lng, coordinates.lat]).addTo(map);

    this.map.set(map);
  }
}
