import { setTheme } from 'ngx-bootstrap';
// import { MetaService } from 'ng2-meta';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GoogleMapsAPIWrapper, AgmMap, LatLngBounds, LatLngBoundsLiteral, MapsAPILoader, AgmCoreModule } from '@agm/core';
import { Component, ElementRef, NgModule, NgZone, OnInit, ViewChild, Input } from '@angular/core';
import { getBoundsOfDistance, isPointInPolygon, getPathLength, getBounds, getAreaOfPolygon } from 'geolib';
import { Console } from 'console';
import { create } from 'bbox';
import * as mapbox from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { Options } from '@angular-slider/ngx-slider';
import { naData } from '../na-boundary';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  title = 'ng6';

  constructor(private http: HttpClient, private route: ActivatedRoute,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {
    setTheme('bs4'); // or 'bs4'
    //console.log.log('1234');
    //  var val = this.getUsers();
    // this.route.queryParams.subscribe(params => {
    //   //console.log.log('params are: ' + JSON.stringify(params));
    //   this.serviceOne(params).subscribe(r => {
    //     //console.log.log(r);
    //   });
    // });
  }
  screenHeight: any = 0;
  lat: Number = 45.9432;
  lng: Number = 24.9668;
  zoom: any = 13;
  @ViewChild("search")
  public searchElementRef: ElementRef;
  map: any;
  mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
  ShadeMap = require('mapbox-gl-shadow-simulator/dist/mapbox-gl-shadow-simulator.umd.min.js');
  // cover = require('@mapbox/tile-cover');
  // tilebelt = require('@mapbox/tilebelt');
  // turf = require('@turf/turf');

  public innerWidth: any;
  navigation: any;
  popup: any;
  inputs: any;
  accessToken: any = 'pk.eyJ1IjoiZmFpemFuNGZpbmUiLCJhIjoiY2s0ODI4ZGpjMHllcjNscXVyM2gxaTB4ZCJ9.1NzDC5BbZ1GODW0TsaOJ7Q';
  step: any = 'open';
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
  userData: any = {};
  naParcel: any = {};
  ngOnInit() {

    this.userData = JSON.parse(localStorage.getItem("userData"));

    console.log(this.userData);
    this.screenHeight = 650;

    this.lat = 30.400867700963577;
    this.lng = 69.41417872258795;
    this.zoom = 5;
    this.step = 'open';
    this.latLng = [this.lng, this.lat];
    this.innerWidth = window.innerWidth;
    //this.getUserLocation();

    let nowTimeMins = this.getFreshTime();
    this.value = nowTimeMins;
    console.log(this.value);

    this.naParcel = naData.boundary();
    console.log(this.naParcel);
  }

  getFreshTime() {
    let d = new Date();
    let hour = d.getHours();
    let min = d.getMinutes();

    let total = 0;
    if (hour > 0) {
      total = hour * 60;
    }

    return total = total + min;
  }

  value: number = 0;
  options: Options = {
    floor: 0,
    ceil: 1440,
    step: 1
  };

  onChangeTime() {
    console.log(this.value);
    console.log(new Date(Date.now()));
    // this.value = 398;
    let tt = this.value * 60;
    let time = 1000 * 60 * tt;
    //time = time - (1000  60  60);

    let nowTimeMins = this.getFreshTime();
    let selectedTime = this.value - nowTimeMins;


    var d = new Date();
    // d.setUTCHours(0, 0, 0, 0);
    console.log(+d);
    // let conversion = +d;
    let conversion = new Date(Date.now() + 1000 * 60 * selectedTime);

    console.log(new Date(Date.now() + 1000 * 60 * selectedTime));
    this.shadeMap.setDate(new Date(conversion));
  }

  getUserLocation() {
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     this.lng = position.coords.longitude;
    //     this.lat = position.coords.latitude;
    //     // this.lat = 51.38685458745143;
    //     // this.lng = -2.701419564597586;
    //     console.log(this.lat, ' - ', this.lng);
    //     this.latLng = [this.lng, this.lat];
    //     this.map.remove();
    //     this.initializeMap(0);
    //   })
    // }

    let geojson = {
      "type": "FeatureCollection",
      "name": "na-boundary-data",
      "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
      "features": []
    }
  }

  latLng: any = [];
  that: any;
  shadeMap: any;
  initializeMap(type) {
    this.mapboxgl.accessToken = this.accessToken;
    this.map = new this.mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/' + this.style,
      center: this.latLng,
      zoom: this.zoom, // starting zoom
      projection: 'globe' // display map as a 3D globe
    });

    const geocoder = new MapboxGeocoder({
      // Initialize the geocoder
      accessToken: this.mapboxgl.accessToken, // Set the access token
      mapboxgl: this.mapboxgl, // Set the mapbox-gl instance
      marker: false, // Do not use the default marker style
      placeholder: 'Location'
    });

    document.getElementById('geocoder').appendChild(geocoder.onAdd(this.map));

    this.map.on('load', () => {

      this.allLayers('');
      // this.shadeLayer();

    });

    // this.map.addControl(new this.mapboxgl.NavigationControl());
    // this.map.addControl(
    //   new this.mapboxgl.GeolocateControl({
    //     positionOptions: {
    //       enableHighAccuracy: true
    //     },
    //     // When active the map will receive updates to the device's location as it changes.
    //     trackUserLocation: true,
    //     // Draw an arrow next to the location dot to indicate which direction the device is heading.
    //     showUserHeading: true
    //   })
    // );

  }

  allLayers(type) {

    console.log('layer loaded');
    this.map.addSource('tiles-geojson', {
      type: 'geojson',
      generateId: true,
      data: {
        type: 'FeatureCollection',
        features: this.naParcel
      }
    });

    this.map.addLayer({
      id: 'grid-layer',
      source: 'tiles-geojson',
      type: 'line',
      //maxzoom: 22,
      // minzoom: this.minimumZoom,
      paint: {
        'line-color': '#000',
        'line-width': 1,
        'line-opacity': 1
      }
    });

    this.map.addLayer({
      id: 'grid-polygon',
      source: 'tiles-geojson',
      type: 'fill',
      maxzoom: 22,
      // minzoom: this.minimumZoom,
      paint: {
        'fill-outline-color': 'rgba(0, 204, 204, 1)',
        'fill-color': 'rgba(0, 204, 204, 0.75)',
        //     'fill-opacity': 0.5
      }
    });

    // this.map.addSource('tiles-centers-geojson', {
    //   type: 'geojson',
    //   generateId: true,
    //   data: {
    //     type: 'FeatureCollection',
    //     features: []
    //   }
    // });

    // this.map.addLayer({
    //   id: 'tiles-centers',
    //   source: 'tiles-centers-geojson',
    //   type: 'symbol',
    //   //maxzoom: 22,
    //   minzoom: 13,
    //   layout: {
    //     'text-field': ['format', ['get', 'text'], { 'font-scale': 0.8 }],
    //     'text-offset': [0, -1],
    //   },
    //   paint: {
    //     'text-color': '#fff',
    //     'text-color-transition': {
    //       duration: 0
    //     }
    //   }
    // });

    // // selected grid layer
    // this.map.addSource('selected-grid', {
    //   type: 'geojson',
    //   data: { "type": "FeatureCollection", "features": [] }
    // });

    // this.map.addLayer(
    //   {
    //     'id': 'grid-polygon-selected',
    //     'type': 'fill',
    //     'source': 'selected-grid',
    //     maxzoom: 22,
    //     minzoom: this.minimumZoom,
    //     'paint': {
    //       'fill-outline-color': '#d3d3d3',
    //       'fill-color': '#d3d3d3',
    //       //'fill-opacity': 0.75
    //     },
    //     'filter': ['in', 'quadkey', '']
    //   }
    // );


    // selected grid layer
    // this.map.addSource('purchased-grid', {
    //   type: 'geojson',
    //   data: { "type": "FeatureCollection", "features": [] }
    // });

    // this.map.addLayer({
    //   id: 'purchased-grid',
    //   source: 'purchased-grid',
    //   type: 'fill',
    //   maxzoom: 22,
    //   minzoom: this.minimumZoom,
    //   paint: {
    //     'fill-outline-color': 'rgba(0, 215, 0, 1)',
    //     'fill-color': 'rgba(0, 215, 0, 0.75)',
    //     //     'fill-opacity': 0.5
    //   }
    // });

    // selected grid layer
    // this.map.addSource('reserved-grid', {
    //   type: 'geojson',
    //   data: { "type": "FeatureCollection", "features": [] }
    // });

    // this.map.addLayer({
    //   id: 'reserved-grid',
    //   source: 'reserved-grid',
    //   type: 'fill',
    //   maxzoom: 22,
    //   minzoom: this.minimumZoom,
    //   paint: {
    //     'fill-outline-color': 'rgba(0, 204, 204, 1)',
    //     'fill-color': 'rgba(0, 204, 204, 0.75)',
    //     //     'fill-opacity': 0.5
    //   }
    // });

    // selected grid layer multiple
    // this.map.addSource('bbox', {
    //   type: 'geojson',
    //   data: { "type": "FeatureCollection", "features": [] }
    // });

    // this.map.addLayer({
    //   id: 'bbox-layer',
    //   source: 'bbox',
    //   type: 'fill',
    //   paint: {
    //     'fill-color': 'red',
    //     'fill-opacity': 0.5
    //   }
    // });

    // during selected grid layer multiple
    // this.map.addSource('bbox-selection', {
    //   type: 'geojson',
    //   data: { "type": "FeatureCollection", "features": [] }
    // });

    // this.map.addLayer({
    //   id: 'bbox-layer-selection',
    //   source: 'bbox-selection',
    //   type: 'fill',
    //   paint: {
    //     'fill-color': '#d3d3d3',
    //     'fill-opacity': 0.5
    //   }
    // });


    //Restricted Area
    // this.map.addSource('restrict', {
    //   type: 'geojson',
    //   data: { "type": "FeatureCollection", "features": [] }
    // });

    // this.map.addLayer({
    //   id: 'restrict-layer',
    //   source: 'restrict',
    //   type: 'fill',
    //   maxzoom: 22,
    //   minzoom: 17,
    //   paint: {
    //     'fill-color': '#d3d3d3',
    //     'fill-opacity': 0.5
    //   }
    // });


    //purchased Area
    // this.map.addSource('purchased', {
    //   type: 'geojson',
    //   data: { "type": "FeatureCollection", "features": [] }
    // });

    // this.map.loadImage('https://placekitten.com/200/200', (error, image) => {
    //   if (error) throw error;
    //   // Add the loaded image to the style's sprite with the ID 'kitten'.
    //   this.map.addImage('kitten', image);
    // });

    // this.map.addLayer({
    //   id: 'purchased-layer',
    //   source: 'purchased',
    //   type: 'fill',
    //   maxzoom: 22,
    //   // minzoom: this.minimumZoom,
    //   paint: {
    //     //'fill-pattern': 'kitten',
    //     'fill-color': ['get', 'color'],
    //     'fill-opacity': 0.8
    //   }
    // });

    // this.map.addSource('points', {
    //   type: 'geojson',
    //   data: { "type": "FeatureCollection", "features": [] }
    // });

    // this.map.addLayer({
    //   id: 'points-layer',
    //   source: 'points',
    //   type: 'symbol',
    //   maxzoom: 22,
    //   // minzoom: this.minimumZoom,
    //   'layout': {
    //     'icon-image': 'kitten',
    //     'icon-size': ['interpolate', ['linear'], ['zoom'], 2, 0.2, 3, 0.4, 4, 0.7, 5, 1, 6, 2, 7, 3]
    //     //'icon-size': 0.4,
    //     // get the title name from the source's "title" property
    //     // 'text-field': ['get', 'title'],
    //     // 'text-font': [
    //     // 'Open Sans Semibold',
    //     // 'Arial Unicode MS Bold'
    //     // ],
    //     // 'text-offset': [0, 1.25],
    //     // 'text-anchor': 'top'
    //   }
    // });

    //update if any selected
    // if (loadType === 1) {
    //   updateSelection(selectedGridArray);
    //   updateRestricted(restrictedArray);
    //   addAvatar(purchasedGridArray);
    // }
  }

  shadeLayer() {
    this.shadeMap = new this.ShadeMap({
      date: new Date(),    // display shadows for current date
      color: '#01112f',    // shade color
      opacity: 0.7,        // opacity of shade color
      apiKey: "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im5hd2F6LmZhaXphbi5mbkBnbWFpbC5jb20iLCJjcmVhdGVkIjoxNzEzNzk2NjY2MDMwLCJpYXQiOjE3MTM3OTY2NjZ9.0Arv9aty8xJrWNfHgnCIhgNAo85EPimZ2r66PkogFwE",    // obtain from https://shademap.app/about/
      // terrainSource: {
      //   // _overzoom: 5,
      //   tileSize: 256,       // DEM tile size
      //   maxZoom: 15,         // Maximum zoom of DEM tile set
      //   getSourceUrl: ({ x, y, z }) => {
      //     // return DEM tile url for given x,y,z coordinates
      //     return `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`
      //   },
      //   getElevation: ({ r, g, b, a }) => {
      //     // return elevation in meters for a given DEM tile pixel
      //     return (r * 256 + g + b / 256) - 32768
      //   },
      // },
      // sunExposure:{
      //   enabled: false,
      //   iterations: 32	
      // },
      getFeatures: () => {
        // wait for map.loaded() to ensure all vector tile data downloaded
        const buildingData = this.map.querySourceFeatures('composite', { sourceLayer: 'building' }).filter((feature) => {
          return feature.properties && feature.properties.underground !== "true" && (feature.properties.height || feature.properties.render_height)
        });
        return buildingData;
      },
      debug: (msg) => { console.log(new Date().toISOString(), msg) },
    }).addTo(this.map);

    // advance shade by 1 hour
    // this.shadeMap.setDate(new Date(Date.now() + 1000  60  60));

    //Now
    this.shadeMap.setDate(new Date(Date.now()));
  }

  onStyleChange(style) {
    this.style = style;
    this.map.remove();
    this.initializeMap(1);
  }

  style: any = 'faizan4fine/ck8pxo4us199a1in2adup5z6z';

  ngAfterViewInit() {
    this.initializeMap(0);
  }


  loggedOut(b: boolean) {
    // this.message = b;

    //console.log.log('Sucribed');
  }

  loggedIn(b: boolean) {
    // this.message = b;

    //console.log.log('Sucribed');
  }


}
