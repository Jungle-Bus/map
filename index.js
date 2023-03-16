var osm_img = "<img src='img/osm.svg' heigth='20px' width='20px' />"
var bus_img = "<img src='img/bus.svg' heigth='20px' width='20px' />"
var wheelchair_img = "<img src='img/wheelchair.svg' heigth='20px' width='20px' />"
var shelter_img = "<img src='img/shelter.svg' heigth='20px' width='20px' />"
var tactile_img = "<img src='img/tactile.svg' heigth='20px' width='20px' />"
var bench_img = "<img src='img/bench.svg' heigth='20px' width='20px' />"
var shelter_bench_img = "<img src='img/shelter_bench.svg' heigth='20px' width='20px' />"
var departures_img = "<img src='img/departures.svg' heigth='20px' width='20px' />"

const vapour_trail_api_base_url = "/api";
const vapour_trail_tileserver_url = `${window.location.origin}/tiles/`;

var map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/positron/style.json?key=GYqiOQp6QhpFgs7X0IjE',
    center: [
        2.34846, 48.8584
    ],
    zoom: 15,
    hash: true
});
map.addControl(
    new MaplibreGeocoder(geocoder_api, {
        maplibregl: maplibregl
    })
);
map.addControl(new maplibregl.GeolocateControl({
    trackUserLocation: true
}));
map.addControl(new maplibregl.NavigationControl());


map.on('load', function () {
    map.loadImage('img/bus-jungle.png', function (error, image) {
        if (error)
            throw error;
        map.addImage('bus-jungle', image);
    });
    map.loadImage('img/rail-jungle.png', function (error, image) {
        if (error)
            throw error;
        map.addImage('rail-jungle', image);
    });
    map.loadImage('img/tram-jungle.png', function (error, image) {
        if (error)
            throw error;
        map.addImage('tram-jungle', image);
    });
    map.loadImage('img/metro-jungle.png', function (error, image) {
        if (error)
            throw error;
        map.addImage('metro-jungle', image);
    });
    map.loadImage('img/ferry-jungle.png', function (error, image) {
        if (error)
            throw error;
        map.addImage('ferry-jungle', image);
    });
    map.loadImage('img/entrance-jungle.png', function (error, image) {
        if (error)
            throw error;
        map.addImage('entrance-jungle', image);
    });

    map.addLayer({
        "id": "landuse_bus_station",
        "type": "fill",
        "source": "openmaptiles",
        "source-layer": "landuse",
        "filter": ["==", "class", "bus_station"],
        "paint": {
            "fill-color": "rgba(2, 103, 177, 0.31)"
        }
    })
    map.addLayer({
        "id": "area_platform",
        "type": "fill",
        "source": "openmaptiles",
        "source-layer": "transportation",
        "filter": [
            "all",
            ["==", "$type", "Polygon"],
            ["==", "class", "path"],
            ["==", "subclass", "platform"],
        ],
        "paint": {
            "fill-color": "rgba(251, 184, 29, 0.41)"
        }
    })
    map.addLayer({
        "id": "entrance_icon",
        "type": "symbol",
        "source": "openmaptiles",
        "source-layer": "poi",
        "minzoom": 15,
        "filter": [
            "all",
            [
                "in",
                "class",
                "entrance",
            ],
            [
                "in",
                "subclass",
                "subway_entrance",
            ]
        ],
        "paint": {
            "text-color": "#fbb81d",            
        },        
        "layout": {
            "icon-image": "entrance-jungle",
            "text-anchor": "top",
            "text-field": "{name:latin}",
            "text-font": ["Noto Sans Regular"],
            "text-max-width": 9,
            "text-offset": [0, 0.7],
            "text-padding": 2,
            "text-size": 10,
            "icon-allow-overlap": true,
            "icon-ignore-placement": false,
            "icon-optional": false,
        }
    });
    map.addLayer({
        "id": "bus_stop_icon",
        "type": "symbol",
        "source": "openmaptiles",
        "source-layer": "poi",
        "filter": [
            "all",
            [
                "in",
                "class",
                "bus",
            ],
            [
                "in",
                "subclass",
                "bus_stop",
            ]
        ],
        "paint": {
            "text-color": "#0267b1",
            "text-halo-color": "white",
            "text-halo-width": 1.2
        },
        "layout": {
            "icon-image": "bus-jungle",
            "text-anchor": "top",
            "text-field": "{name:latin}",
            "text-font": ["Noto Sans Regular"],
            "text-max-width": 9,
            "text-offset": [0, 0.7],
            "text-padding": 2,
            "text-size": 10,
            "icon-allow-overlap": true,
            "icon-ignore-placement": false,
            "icon-optional": false,
        }
    });
    map.addLayer({
        "id": "train_stop_icon",
        "type": "symbol",
        "source": "openmaptiles",
        "source-layer": "poi",
        "filter": [
            "all",
            [
                "in",
                "class",
                "railway",
            ],
            [
                "in",
                "subclass",
                "station",
            ]
        ],
        "paint": {
            "text-color": "#fbb81d",
            "text-halo-color": "white",
            "text-halo-width": 2.3
        },        
        "layout": {
            "icon-image": "rail-jungle",
            "text-anchor": "top",
            "text-field": "{name:latin}",
            "text-font": ["Noto Sans Regular"],
            "text-max-width": 9,
            "text-offset": [0, 0.7],
            "text-padding": 2,
            "text-size": 10,
            "icon-allow-overlap": true,
            "icon-ignore-placement": false,
            "icon-optional": false,
        }
    });
    map.addLayer({
        "id": "tram_stop_icon",
        "type": "symbol",
        "source": "openmaptiles",
        "source-layer": "poi",
        "filter": [
            "all",
            [
                "in",
                "class",
                "railway",
            ],
            [
                "in",
                "subclass",
                "tram_stop",
            ]
        ],
        "paint": {
            "text-color": "#fbb81d",
            "text-halo-color": "white",
            "text-halo-width": 2.3
        },          
        "layout": {
            "icon-image": "tram-jungle",
            "text-anchor": "top",
            "text-field": "{name:latin}",
            "text-font": ["Noto Sans Regular"],
            "text-max-width": 9,
            "text-offset": [0, 0.7],
            "text-padding": 2,
            "text-size": 10,
            "icon-allow-overlap": true,
            "icon-ignore-placement": false,
            "icon-optional": false,
        }
    });
    map.addLayer({
        "id": "subway_stop_icon",
        "type": "symbol",
        "source": "openmaptiles",
        "source-layer": "poi",
        "filter": [
            "all",
            [
                "in",
                "class",
                "railway",
            ],
            [
                "in",
                "subclass",
                "subway",
            ]
        ],
        "paint": {
            "text-color": "#fbb81d",
            "text-halo-color": "white",
            "text-halo-width": 2.3
        },  
        "layout": {
            "icon-image": "metro-jungle",
            "text-anchor": "top",
            "text-field": "{name:latin}",
            "text-font": ["Noto Sans Regular"],
            "text-max-width": 9,
            "text-offset": [0, 0.7],
            "text-padding": 2,
            "text-size": 10,
            "icon-allow-overlap": true,
            "icon-ignore-placement": false,
            "icon-optional": false,
        }
    });
    map.addLayer({
        "id": "ferry_stop_icon",
        "type": "symbol",
        "source": "openmaptiles",
        "source-layer": "poi",
        "filter": [
            "all",
            [
                "in",
                "class",
                "ferry_terminal",
            ],
            [
                "in",
                "subclass",
                "ferry_terminal",
            ]
        ],
        "paint": {
            "text-color": "#7DC373",
            "text-halo-color": "white",
            "text-halo-width": 1.8
        },  
        "layout": {
            "icon-image": "ferry-jungle",
            "text-anchor": "top",
            "text-field": "{name:latin}",
            "text-font": ["Noto Sans Regular"],
            "text-max-width": 9,
            "text-offset": [0, 0.7],
            "text-padding": 2,
            "text-size": 10,
            "icon-allow-overlap": true,
            "icon-ignore-placement": false,
            "icon-optional": false,
        }
    });

    const layer_list = ['ferry_stop_icon', 'subway_stop_icon', 'tram_stop_icon', 'train_stop_icon', 'bus_stop_icon', 'entrance_icon']
    for (const layer of layer_list) {
        map.on('mouseenter', layer, function () {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', layer, function () {
            map.getCanvas().style.cursor = '';
        });
    }

    const objects_mapping = {
        "bus_stop": "Arrêt de bus",
        "ferry_terminal": "Arrêt de ferry",
        "subway": "Station de métro",
        "tram_stop": "Arrêt de tramway",
        "station": "Gare",
        "subway_entrance": "Accès de gare ou station"
    }

    async function display_stop_popup(e) {
        if (map.getZoom() < 14) {
            return
        }
        var caisson_content = `
                <div id="close_caisson_button"></div>
                <div class="w3-row-padding w3-content">
                    <div class="w3-container w3-card w3-white w3-margin-bottom">
                        <div class="w3-container">
                            <h4 class="w3-opacity"><b><span id="object_name_html"><span></b></h4>
                            <span id="object_type_html"><span>
                        </div>
                    </div>
                <div id="object_detail_html"></div>
                <div id="stations_list_html"></div>
                <div id="stops_list_html"></div>
                <div id="routes_list_html"></div>
                <div class="osm_attribution" id="osm_attribution_html">
                </div>
        `
        caisson.add_content(caisson_content)
        var close_caisson_button = document.getElementById('close_caisson_button')
        close_caisson_button.innerHTML = `<span onclick='close_caisson()'>x</span>`;

        var feature = e.features[0];

        var object_type = feature.properties.subclass || feature.properties.class;
        var object_temp_name = feature.properties.name

        object_name_html.innerHTML = `${object_temp_name || ""}`;
        object_type_html.innerHTML = `${objects_mapping[object_type]}`;

        var longitude = feature.geometry.coordinates[0]
        var latitude = feature.geometry.coordinates[1]
        if (feature.geometry.type == "Polygon") {
            var latitude = e.lngLat.lat
            var longitude = e.lngLat.lng
        }


        if (object_type == "bus_stop") {
            var status = await bus_stop_data.init_from_overpass(latitude, longitude);
            if (status != "ok") {
                return
            }

            var stop_tags = bus_stop_data.get_tags();
            object_detail_html.innerHTML = display_bus_stop_details(stop_tags)
            object_name_html.innerHTML = stop_tags.name || "<i>Arrêt sans nom</i>"

            var routes_at_stop = bus_stop_data.get_routes();
            if (routes_at_stop.length > 0) {
                routes_list_html.innerHTML = display_routes_list(routes_at_stop);
            }

            var stop_id = bus_stop_data.get_osm_id();
            osm_attribution_html.innerHTML = display_credits(stop_id, "node")

        } else if (object_type == "ferry_terminal") {
            var status = await ferry_stop_data.init_from_overpass(latitude, longitude);
            if (status != "ok") {
                return
            }

            var stop_tags = ferry_stop_data.get_tags();
            object_detail_html.innerHTML = display_bus_stop_details(stop_tags)
            object_name_html.innerHTML = stop_tags.name || "<i>Arrêt sans nom</i>"

            var routes_at_stop = ferry_stop_data.get_routes();
            if (routes_at_stop.length > 0) {
                routes_list_html.innerHTML = display_routes_list(routes_at_stop);
            }

            var stop_id = ferry_stop_data.get_osm_id();
            osm_attribution_html.innerHTML = display_credits(stop_id, "node")

        } else if (object_type == "tram_stop") {
            var status = await tram_stop_data.init_from_overpass(latitude, longitude);
            if (status != "ok") {
                return
            }

            var stop_tags = tram_stop_data.get_tags();
            object_detail_html.innerHTML = display_bus_stop_details(stop_tags)
            object_name_html.innerHTML = stop_tags.name || "<i>Arrêt sans nom</i>"

            var routes_at_stop = tram_stop_data.get_routes();
            if (routes_at_stop.length > 0) {
                routes_list_html.innerHTML = display_routes_list(routes_at_stop);
            }

            var stop_id = tram_stop_data.get_osm_id();
            osm_attribution_html.innerHTML = display_credits(stop_id, "node")

        } else if (object_type == "subway_entrance") {
            var status = await railway_entrance_data.init_from_overpass(latitude, longitude);
            if (status != "ok") {
                return
            }
            var entrance_tags = railway_entrance_data.get_tags();
            object_detail_html.innerHTML = display_entrance_details(entrance_tags);
            object_name_html.innerHTML = entrance_tags.name || "<i>Sortie sans nom</i>"

            var stations_at_stop = railway_entrance_data.get_stations();
            if (stations_at_stop.length > 0) {
                stations_list_html.innerHTML = display_stations_list(stations_at_stop);
            }

            var entrance_id = railway_entrance_data.get_osm_id();
            osm_attribution_html.innerHTML = display_credits(entrance_id, "node")
        } else if (object_type == "station" || object_type == "subway") {
            var status = await station_data.init_from_overpass(latitude, longitude);
            if (status != "ok") {
                return
            }
            var station_tags = station_data.get_tags();
            object_detail_html.innerHTML = display_station_details(station_tags);
            object_name_html.innerHTML = station_tags.name || "<i>Gare sans nom</i>"

            var station_tags = station_data.get_osm_id();
            osm_attribution_html.innerHTML = display_credits(station_tags, "node")
        }

    };

    for (const layer of layer_list) {
        map.on('click', layer, function (e) {
            if (map.getZoom() < 14) {
                map.flyTo({
                    center: e.features[0].geometry.coordinates,
                    zoom: 15
                });
            }
            display_stop_popup(e);
        });
    }


});

function display_stops_list(stops_list) {
    var template = `
    <div class="w3-container w3-card w3-white w3-margin-bottom">
        <div class="w3-container">
            <h5 class="w3-opacity"><b>Arrêts</b></h5>
            <p>${stops_list.length} arrêts</p>
        </div>
    </div>`
    return template
}

function display_routes_list(routes_list) {
    var routes_elems = "";
    for (const route of routes_list) {
        routes_elems += `<transport-thumbnail
                data-transport-network="${route.tags['network'] || '??'}"
                data-transport-mode="bus"
                data-transport-line-code="${route.tags['ref'] || '??'}"
                data-transport-line-color="${route.tags['colour'] || "grey"}"
                data-transport-destination="${route.tags['to'] || '??'}">
            </transport-thumbnail></br>
            `
    }

    var template = `
            <div class="w3-container w3-card w3-white w3-margin-bottom">
                <div class="w3-container">
                    <h5 class="w3-opacity"><b>Lignes desservies</b></h5>
                    ${routes_elems}
                </div>
                <p></p>
            </div>
    `
    return template
}

function display_stations_list(stations_list) {
    var stations_elems = "";
    for (const station of stations_list) {
        stations_elems += `<li> ${station.tags.name || '<i>Station sans nom</i>'}
            <a href='https://www.openstreetmap.org/relation/${station.stop_area_id}' target='_blank'>🔗</a> </br>
            `
    }

    var template = `
            <div class="w3-container w3-card w3-white w3-margin-bottom">
                <div class="w3-container">
                    <h5 class="w3-opacity"><b>Stations</b></h5>
                    <ul>
                    ${stations_elems}
                    </ul>
                </div>
            </div>
    `
    return template
}

function display_credits(osm_object_id, osm_type) {
    var template = `
      <div class="w3-container w3-card w3-white w3-margin-bottom">
        <div class="w3-container">
        <h5 class="w3-opacity"><b>Crédits</b></h5>
        <p>
            <img src="img/osm.svg" alt="OSM Logo" class="w3-left w3-margin-right" style="width:60px">
      		 Ces informations proviennent d'OpenStreetMap, la carte collaborative libre.
        </p>
        <p> <a href="/map/services">Signaler une erreur / Compléter les informations</a></p>
        <p><i class="w3-margin-right">🔗</i><a href="https://openstreetmap.org/${osm_type}/${osm_object_id}" target="_blank">Voir sur OpenStreetMap</a></p>

        </div>
      </div>
    `
    return template
}

function get_wheelchair_translation(wheelchair_tag){
    var wheelchair = "accessibilité aux fauteuils roulants inconnue";
    if (wheelchair_tag == "yes") {
        wheelchair = "est accessible aux fauteuils roulants"
    } else if (wheelchair_tag == "no") {
        wheelchair = "n'est pas accessible aux fauteuils roulants"
    } else if (wheelchair_tag == "limited") {
        wheelchair = "est partiellement accessible aux fauteuils roulants"
    }
    return wheelchair
}

function display_bus_stop_details(stop_tags) {
    var wheelchair = get_wheelchair_translation(stop_tags.wheelchair)

    var lit = ""
    if (stop_tags.lit == "yes") {
        lit = "<li> est éclairé"
    } else if (stop_tags.lit == "no") {
        lit = "<li> n'est pas éclairé"
    }

    var tactile_paving = ""
    if (stop_tags.tactile_paving == "yes") {
        tactile_paving = "<li> est équipé d'une bande d'éveil à la vigilance"
    } else if (stop_tags.tactile_paving == "no") {
        tactile_paving = "<li> n'est pas équipé de bande d'éveil à la vigilance"
    }

    var departures_board = ""
    if (stop_tags.departures_board == "yes" || stop_tags.departures_board == "timetable" ) {
        departures_board = "<li> dispose d'information voyageur"
    } else if (stop_tags.departures_board == "no") {
        departures_board = "<li> ne propose pas d'information voyageur"
    } else if (stop_tags.departures_board == "realtime") {
        departures_board = "<li> dispose d'information voyageur en temps réel"
    }

    var shelter = ""
    if (stop_tags.shelter == "yes") {
        shelter = "<li> est équipé d'un abribus"
    }
    var bench = ""
    if (stop_tags.bench == "yes") {
        bench = "<li> est équipé d'un banc"
    }
    var local_ref = ""
    if (stop_tags.local_ref) {
        local_ref = `<li> ${stop_tags.local_ref}`
    }

    var template = `
    <div class="w3-container w3-card w3-white w3-margin-bottom">
        <div class="w3-container">
            <h5 class="w3-opacity"><b>Propriétés</b></h5>
            <ul>
            ${local_ref}
            <li> ${wheelchair}
            ${lit}
            ${tactile_paving}
            ${departures_board}
            ${shelter}
            ${bench}
            </ul>
        </div>
    </div>`
    return template
}

function display_entrance_details(stop_tags) {
    var ref = ""
    if (stop_tags.ref) {
        ref = `<li> sortie n° ${stop_tags.ref}`
    }
    var automatic_door = ""
    if (stop_tags.automatic_door) {
        automatic_door = `<li> dispose d'une porte automatique`
    }
    var template = `
            <div class="w3-container w3-card w3-white w3-margin-bottom">
                <div class="w3-container">
                    <h5 class="w3-opacity"><b>Propriétés</b></h5>
                    <ul>
                    ${ref}
                    <li> ${get_wheelchair_translation(stop_tags.wheelchair)}
                    ${automatic_door}
                    </ul>
                </div>
            </div>`
    return template
}

function display_station_details(stop_tags) {

    var toilets = ""
    if (stop_tags.toilets == "yes") {
        toilets = `<li> dispose de toilettes`
    }
    var wifi = ""
    if (stop_tags.internet_access == "yes" || stop_tags.internet_access == "wlan" ) {
        wifi = `<li> propose un accès internet`
    }    
    var template = `
            <div class="w3-container w3-card w3-white w3-margin-bottom">
                <div class="w3-container">
                    <h5 class="w3-opacity"><b>Propriétés</b></h5>
                    <ul>
                    <li> ${get_wheelchair_translation(stop_tags.wheelchair)}
                    ${toilets}
                    ${wifi}
                    </ul>
                </div>
            </div>`
    return template
}

function close_caisson() {
    caisson.remove()
};