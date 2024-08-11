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
import { AppService } from '../app.service';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  title = 'ng6';
  constructor(private http: HttpClient, private appService: AppService, private spinner: NgxSpinnerService, private route: ActivatedRoute,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {
    setTheme('bs4'); // or 'bs4'
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

  public innerWidth: any;
  navigation: any;
  inputs: any;
  accessToken: any = 'pk.eyJ1IjoiZmFpemFuNGZpbmUiLCJhIjoiY2s0ODI4ZGpjMHllcjNscXVyM2gxaTB4ZCJ9.1NzDC5BbZ1GODW0TsaOJ7Q';
  step: any = 'open';
  NAList: any = [];
  naListSorted: string[]= []; // Define a separate variable to store the sorted NA list
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

    console.log(this.value);

    this.naParcel = naData.boundary();
    // console.log(this.naParcel);
    this.formattingData();
    this.getVoteList();
  }

  voteDataList: any = [];
  getVoteList() {
    this.spinner.show();
    this.voteDataList = [];
    this.appService.getVote().subscribe(res => {
      // console.log(res);
      if (res.length > 0) {
        res.sort((a, b) => (Number(a.vote) < Number(b.vote)) ? 1 : ((Number(b.vote) < Number(a.vote)) ? -1 : 0));
        this.voteDataList = res;
        this.naParcel.forEach(res => {
          let filteredArray = this.voteDataList.filter(x => x.na_block == res.properties.NA_Cons);
          if (filteredArray.length > 0) {
            res.properties['data'] = filteredArray;
          } else {
            res.properties['data'] = [];
          }
        })

        this.initializeMap(0);
      } else {
        swal('Some Error', '', 'error');
        this.initializeMap(0);
      }
      this.spinner.hide();
    })
  }
  formattingData() {
    this.NAList = this.naParcel.map(res => res.properties.NA_Cons)
      .filter(na => /\d+/.test(na))
      .sort((a, b) => {
        const naA = parseInt(a.match(/\d+/)[0]);
        const naB = parseInt(b.match(/\d+/)[0]);
        return naA - naB;
      });
    this.naListSorted = [...this.NAList]; // Copy sorted list to maintain original sorting
  }


  value: number = 0;
  options: Options = {
    floor: 0,
    ceil: 1440,
    step: 1
  };

  latLng: any = [];
  that: any;
  shadeMap: any;
  popup: any;

  initializeMap(type) {
    this.mapboxgl.accessToken = this.accessToken;
    this.map = new this.mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/' + this.style,
      center: this.latLng,
      zoom: this.zoom, // starting zoom
      projection: 'globe' // display map as a 3D globe
    });

    this.map.addControl(new this.mapboxgl.NavigationControl());

    this.popup = new this.mapboxgl.Popup({
      closeButton: false,
    });

    const geocoder = new MapboxGeocoder({
      // Initialize the geocoder
      accessToken: this.mapboxgl.accessToken, // Set the access token
      mapboxgl: this.mapboxgl, // Set the mapbox-gl instance
      marker: false, // Do not use the default marker style
      placeholder: 'Location'
    });

    document.getElementById('geocoder').appendChild(geocoder.onAdd(this.map));

    var that = this;

    this.map.on('load', () => {

      this.allLayers('');
      // this.shadeLayer();

      this.map.on('mousemove', 'grid-polygon', (e) => {
        // Copy coordinates array.

        const coordinates = e.lngLat;
        const na = e.features[0].properties.NA_Cons;
        const district = e.features[0].properties.District;
        const province = e.features[0].properties.Province;
        let voteData = JSON.parse(e.features[0].properties.data);

        let candidates = '';
        if (voteData && voteData.length > 0) {
          voteData.sort((a, b) => (Number(a.vote) < Number(b.vote)) ? 1 : ((Number(b.vote) < Number(a.vote)) ? -1 : 0));
          voteData.forEach(res => {
            candidates += '<p style="font-size: 14px; color: #6770ff;">' + res.candidate + ' - ' + res.party + ': (' + res.vote + ')' + '</p>'
          })
        }

        let html = '<div style="width=130px;"><h3>' + na + '</h3>'
          + candidates
          + '<p>District: ' + district + '</p>'
          + '<p>Province: ' + province + '</p></div>'
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }


        that.popup.setLngLat(coordinates)
        that.popup.setHTML(html)
        that.popup.addTo(that.map);
      });

      this.map.on('mouseleave', 'grid-polygon', function () {
        that.map.getCanvas().style.cursor = '';
        that.popup.remove();
      });

    });

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

    this.map.addLayer({
      id: 'na-numbers',
      type: 'symbol',
      source: 'tiles-geojson',
      layout: {
        'text-field': ['get', 'NA_Cons'],
        'text-size': 12,
        'text-anchor': 'top'
      },
      paint: {
        'text-color': '#000',
        'text-halo-color': '#FFF', 
        'text-halo-width': 2
      }
    });
    
  }



  onStyleChange(style) {
    this.style = style;
    this.map.remove();
    this.initializeMap(1);
  }

  selectedProvince: any = '';
  selectProvince(val) {
    this.selectedProvince = val;
    this.changeLayer('province', val);
  }

  selectedNA: any = '';
  selectNA(val) {
    this.selectedNA = val;
    this.changeLayer('na', val);
    this.NAList = this.naListSorted.slice(); // Update the NA list with the sorted list
  }
  

  selectedProvinceParcel: any = [];
  changeLayer(type, val) {
    if (type === 'province') {
      let parcel = [];
      this.selectedProvinceParcel = [];
      this.NAList = [];
      if (val === '') {
        this.naParcel.forEach(res => {
          this.NAList.push(res.properties.NA_Cons);
        });
        parcel = this.naParcel;
      } else {
        this.naParcel.forEach(res => {
          if (res.properties.Province === val) {
            this.selectedProvinceParcel.push(res);
            this.NAList.push(res.properties.NA_Cons);
          }
        });
        parcel = this.selectedProvinceParcel;
      }
  
      this.map.getSource('tiles-geojson').setData({
        type: 'FeatureCollection',
        features: parcel
      });
  
      let zoom = 5;
      if (val === '') {
        zoom = 4;
      }
  
      if (parcel.length > 0) {
        this.map.flyTo({
          center: [parcel[0].geometry.coordinates[0][0][0][0], parcel[0].geometry.coordinates[0][0][0][1]],
          zoom: zoom,
          speed: 1,
        });
      }
    }
  
    if (type === 'na') {
      let parcel = [];
      if (val === '') {
        if (val === '' && this.selectedProvinceParcel.length === 0) {
          parcel = this.naParcel;
        } else {
          parcel = this.selectedProvinceParcel;
        }
      } else {
        if (this.selectedProvinceParcel.length === 0) {
          this.naParcel.forEach(res => {
            if (res.properties.NA_Cons === val) {
              parcel.push(res);
            }
          });
        } else {
          this.selectedProvinceParcel.forEach(res => {
            if (res.properties.NA_Cons === val) {
              parcel.push(res);
            }
          });
        }
      }
  
      this.map.getSource('tiles-geojson').setData({
        type: 'FeatureCollection',
        features: parcel
      });
  
      // Fit the map to the selected NA's area
      if (parcel.length > 0) {
        const bounds = new this.mapboxgl.LngLatBounds();
        parcel[0].geometry.coordinates[0][0].forEach(coordinate => {
          bounds.extend(coordinate);
        });
  
        // Smoothly fly to the bounds of the selected NA's area
        this.map.fitBounds(bounds, {
          padding: 50, // Adjust the padding as needed
          maxZoom: 14, // Limit the max zoom level if necessary
          speed: 0.5, // Adjust speed as needed
          curve: 1.2 // Adjust curve as needed
        });
  
        // Calculate centroid and NA number
        const centroidData = this.calculateCentroid(parcel[0].geometry.coordinates[0][0], val);
  
        // Create a popup with the NA number
        const popup = new this.mapboxgl.Popup().setHTML('<h3>' + centroidData.naNumber + '</h3>');
  
        // Add a marker at the centroid of the selected NA's area
        const marker = new this.mapboxgl.Marker().setLngLat(centroidData.centroid).addTo(this.map);
  
        // Set the popup for the marker
        marker.setPopup(popup);
  
        // Open the popup immediately after adding the marker to the map
        marker.openPopup();
      }
    }
  
    this.NAList.sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0));
  }
  
  
// Modify the calculateCentroid function to accept the NA number
calculateCentroid(coordinates, naNumber) {
  let centerX = 0,
    centerY = 0;

  for (let i = 0; i < coordinates.length; i++) {
    centerX += coordinates[i][0];
    centerY += coordinates[i][1];
  }

  centerX /= coordinates.length;
  centerY /= coordinates.length;

  // Return an object containing the centroid coordinates and the NA number
  return {
    centroid: [centerX, centerY],
    naNumber: naNumber
  };
}





  style: any = 'faizan4fine/ck8pxo4us199a1in2adup5z6z';

  ngAfterViewInit() {
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


