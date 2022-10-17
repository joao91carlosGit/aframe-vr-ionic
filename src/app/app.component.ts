import { Component } from '@angular/core';
import * as AFRAME from 'aframe';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor() {
    this.register();
  }

  register() {
    AFRAME.registerComponent('infogroup', {
      init: function () {
        this.el.addEventListener('reloadinfo', function (evt) {
          //alert(evt.detail.currinfo+"   "+evt.detail.newinfo);
          //get the entire current spot group and scale it to 0
          var currinfogroup = document.getElementById(evt.detail.currinfo);
          currinfogroup.setAttribute("scale", "0 0 0");

          //get the entire new spot group and scale it to 1
          var newinfogroup = document.getElementById(evt.detail.newinfo);
          newinfogroup.setAttribute("scale", "1 1 1");
        });
      }
    });
    AFRAME.registerComponent('infoicon', {
      schema: {
        linkto: { type: "string", default: "" },
        infogroup: { type: "string", default: "" }
      },
      init: function () {

        //add image source of hotspot icon
        this.el.setAttribute("src", "#info-icon");
        //resize
        this.el.setAttribute("scale", "0.5 0.5 0.5");
        //make the icon look at the camera all the time
        this.el.setAttribute("look-at", "#cam");

        var data = this.data;

        this.el.addEventListener('click', function () {
          this.setAttribute("scale", "2.5 1.25 1");
          this.setAttribute("src", data.infolink);
        });
        this.el.addEventListener('mouseleave', function () {
          this.setAttribute("scale", "0.5 0.5 0.5");
          this.setAttribute("src", "#info-icon");

          var cur = document.querySelector("#cursor-visual");
          cur.emit("stopFuse");
        });
        this.el.addEventListener('mouseenter', function (evt) {
          var cur = document.querySelector("#cursor-visual");
          cur.emit("startFuse");

        });
      }
    });


    AFRAME.registerComponent('hotspots', {
      init: function () {
        this.el.addEventListener('reloadspots', function (evt) {

          //get the entire current spot group and scale it to 0
          var currspotgroup = document.getElementById(evt.detail.currspots);
          currspotgroup.setAttribute("scale", "0 0 0");

          //get the entire new spot group and scale it to 1
          var newspotgroup = document.getElementById(evt.detail.newspots);
          newspotgroup.setAttribute("scale", "1 1 1");
        });
      }
    });


    function loadNewSpotDetails() {

      //set the skybox source to the new image as per the spot
      var sky = document.getElementById("skybox");
      sky.setAttribute("src", ndata.linkto);

      var spotcomp = document.querySelector("#spots");
      var currspots = nthis.parentElement.getAttribute("id");
      //create event for spots component to change the spots data
      spotcomp.emit('reloadspots', { newspots: ndata.spotgroup, currspots: currspots });


      var infocomp = document.querySelector("#infos");
      var currinfo = ndata.infoparent;
      //create event for spots component to change the spots data
      infocomp.emit('reloadinfo', { currinfo: currinfo, newinfo: ndata.infogroup });

      //var ncam=document.getElementById("cam");
      //this.setAttribute("camera","fov",80);
      this.emit("zoomout");

      var fp = document.querySelector("#camfadeplane");
      fp.emit("camFadeOut");

    }
    var ndata;
    var nthis;


    AFRAME.registerComponent('spot', {
      schema: {
        linkto: { type: "string", default: "" },
        spotgroup: { type: "string", default: "" },
        infogroup: { type: "string", default: "" },
        infoparent: { type: "string", default: "" }
      },
      init: function () {

        //add image source of hotspot icon
        this.el.setAttribute("src", "#hotspot");
        //make the icon look at the camera all the time
        this.el.setAttribute("look-at", "#cam");
        var data = this.data;
        this.el.addEventListener('click', function () {
          ndata = data;
          nthis = this;
          var cam = document.querySelector("#cam");
          cam.emit("zoomin");
          
          cam.addEventListener("animationcomplete", loadNewSpotDetails);
          var fp = document.querySelector("#camfadeplane");
          fp.emit("camFadeIn");
          //alert("Start zoom");
        });
        this.el.addEventListener('mouseleave', function () {
          var cur = document.querySelector("#cursor-visual");
          cur.emit("stopFuse");
        });
        this.el.addEventListener('mouseenter', function (evt) {
          var cur = document.querySelector("#cursor-visual");
          cur.emit("startFuse");
        });
      }
    });

  }
} 