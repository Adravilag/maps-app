import { AfterViewInit, Component, ElementRef, signal, viewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment.development';
import { v4 as uuidv4 } from 'uuid';
import { JsonPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapboxToken;

interface Marker {
  id: string;
  color: string;
  mapBoxMarker: mapboxgl.Marker;
}

@Component({
  selector: 'app-markers-page',
  imports: [JsonPipe],
  templateUrl: './markers-page.component.html',
})
export class MarkersPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef<HTMLDivElement>>('map');
  map = signal<mapboxgl.Map | null>(null);
  markers = signal<Marker[]>([]);

  async ngAfterViewInit(): Promise<void> {
    if (!this.divElement) throw new Error('No se encontró el elemento HTML');

    const element = this.divElement()!.nativeElement;
    if (!element) throw new Error('No se encontró el elemento HTML');

    await new Promise((resolve) => setTimeout(resolve, 80));

    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 14, // starting zoom
    });

    //   const marker = new mapboxgl.Marker({ draggable: false, color: '#000' })
    //     .setLngLat([-74.5, 40])
    //     .addTo(map);

    //   marker.on('dragend', () => {
    //     const { lng, lat } = marker.getLngLat();
    //     console.log({ lng, lat });
    //   });

    this.mapListener(map);

    // }
    this.map.set(map);
  }

  mapListener(map: mapboxgl.Map) {
    this.map.set(map);
    map.on('click', (event) => {
      this.mapClick(event);
    });
  }

  mapClick(event: mapboxgl.MapMouseEvent) {

    if (!this.map()) throw new Error('El mapa no está inicializado');
    const map = this.map()!; // No es null

    // Generar un color aleatorio
    const color = '#xxxxxx'.replace(/x/g, (y) => ((Math.random() * 16) | 0).toString(16));

    // Crear un marcador
    const { lng, lat } = event.lngLat;
    const marker = new mapboxgl.Marker({ color }).setLngLat([lng, lat]).addTo(map);

    // Guardar el marcador en el arreglo
    const newMarker: Marker = {
      id: uuidv4(),
      color,
      mapBoxMarker: marker,
    };

    this.markers.set([...(this.markers()), newMarker]);
  }

  flyToMarker(lngat: mapboxgl.LngLatLike) {
    if (!this.map()) throw new Error('El mapa no está inicializado');
    const map = this.map()!; // No es null
    map.flyTo({
      zoom: 14,
      center: lngat
    });
  }

  deleteMarker(marker: Marker) {
    if (!this.map()) throw new Error('El mapa no está inicializado');
    const map = this.map()!; // No es null

    // Eliminar del mapa
    marker.mapBoxMarker.remove();

    // Eliminar del arreglo
    this.markers.set(this.markers().filter((m) => m.id !== marker.id));
  }

}
