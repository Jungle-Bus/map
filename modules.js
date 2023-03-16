var caisson = (function () {
    var popup_div = document.getElementById('caisson') || null;
    if (!popup_div) {
        console.log("La div d'id 'caisson' n'existe pas")
    }
    return {
        add_content: function (content) {
            popup_div.style.display = 'block';
            popup_div.innerHTML = content || ''
        },
        remove: function () {
            if (popup_div.style.display == 'block') {
                popup_div.style.display = 'none'
            }
        }
    }
}());

var geocoder_api = {
    forwardGeocode: async (config) => {
        const features = [];
        try {
            let request =
                'https://nominatim.openstreetmap.org/search?q=' +
                config.query +
                '&format=geojson&polygon_geojson=1&addressdetails=1';
            const response = await fetch(request);
            const geojson = await response.json();
            for (let feature of geojson.features) {
                let center = [
                    feature.bbox[0] +
                    (feature.bbox[2] - feature.bbox[0]) / 2,
                    feature.bbox[1] +
                    (feature.bbox[3] - feature.bbox[1]) / 2
                ];
                let point = {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: center
                    },
                    place_name: feature.properties.display_name,
                    properties: feature.properties,
                    text: feature.properties.display_name,
                    place_type: ['place'],
                    center: center
                };
                features.push(point);
            }
        } catch (e) {
            console.error(`Failed to forwardGeocode with error: ${e}`);
        }

        return {
            features: features
        };
    }
};

const overpass_base_url = 'https://overpass-api.de/api/interpreter?data='

var bus_stop_data = (function () {
    var stop_tags;
    var stop_id;
    var routes_at_stop;

    return {
        get_tags: function () {
            return stop_tags;
        },
        get_osm_id: function () {
            return stop_id;
        },
        get_routes: function () {
            return routes_at_stop;
        },
        /**
         * fetch and process data
         * return a status
         */
        init_from_overpass: async function (latitude, longitude) {
            try {
                stop_tags = {}
                stop_id = ""
                routes_at_stop = []

                const stop_detail_url = `${overpass_base_url}[out:json];(node["highway"="bus_stop"](around:5,${latitude},${longitude});)->.a;relation(bn);out tags;.a out;`;

                const overpass_response = await fetch(stop_detail_url);
                const overpass_data = await overpass_response.json();

                if (overpass_data['elements'].length == 0) {
                    var overpass_empty_error = "Erreur à l'appel overpass : la réponse retournée ne contient pas d'éléments"
                    console.error(overpass_empty_error)
                    return overpass_empty_error

                }
                for (const osm_element of overpass_data['elements']) {
                    if (osm_element.type == "node") {
                        stop_tags = osm_element.tags
                        stop_id = osm_element.id
                    }
                    if (osm_element.type == "relation") {
                        if (osm_element.tags.type == "route") {
                            routes_at_stop.push({
                                "route_id": osm_element.id,
                                "tags": osm_element.tags,
                            })
                        }

                    }

                }
                return 'ok'
            } catch (error) {
                console.error(error)
                return "Oops, something went wrong"
            }
        }
    }
}());

var railway_entrance_data = (function () {
    var entrance_tags;
    var stations_at_entrance;
    var entrance_id;

    return {
        get_tags: function () {
            return entrance_tags;
        },
        get_osm_id: function () {
            return entrance_id;
        },
        get_stations: function () {
            return stations_at_entrance;
        },
        /**
         * fetch and process data
         * return a status
         */
        init_from_overpass: async function (latitude, longitude) {
            try {
                entrance_tags = {}
                entrance_id = ""
                stations_at_entrance = []

                const entrance_detail_url = `${overpass_base_url}[out:json];(node["railway"="subway_entrance"](around:5,${latitude},${longitude});)->.a;relation(bn);out tags;.a out;`;

                const overpass_response = await fetch(entrance_detail_url);
                const overpass_data = await overpass_response.json();

                if (overpass_data['elements'].length == 0) {
                    var overpass_empty_error = "Erreur à l'appel overpass : la réponse retournée ne contient pas d'éléments"
                    console.error(overpass_empty_error)
                    return overpass_empty_error

                }
                for (const osm_element of overpass_data['elements']) {
                    if (osm_element.type == "node") {
                        entrance_tags = osm_element.tags
                        entrance_id = osm_element.id
                    }
                    if (osm_element.type == "relation") {
                        if (osm_element.tags.type == "public_transport") {
                            stations_at_entrance.push({
                                "stop_area_id": osm_element.id,
                                "tags": osm_element.tags,
                            })
                        }

                    }
                }
                return 'ok'
            } catch (error) {
                console.error(error)
                return "Oops, something went wrong"
            }
        }
    }
}());

var tram_stop_data = (function () {
    var stop_tags;
    var stop_id;
    var routes_at_stop;

    return {
        get_tags: function () {
            return stop_tags;
        },
        get_osm_id: function () {
            return stop_id;
        },
        get_routes: function () {
            return routes_at_stop;
        },
        /**
         * fetch and process data
         * return a status
         */
        init_from_overpass: async function (latitude, longitude) {
            try {
                stop_tags = {}
                stop_id = ""
                routes_at_stop = []

                const stop_detail_url = `${overpass_base_url}[out:json];(node["railway"="tram_stop"](around:3,${latitude},${longitude});)->.a;relation(bn);out tags;.a out;`;

                const overpass_response = await fetch(stop_detail_url);
                const overpass_data = await overpass_response.json();

                if (overpass_data['elements'].length == 0) {
                    var overpass_empty_error = "Erreur à l'appel overpass : la réponse retournée ne contient pas d'éléments"
                    console.error(overpass_empty_error)
                    return overpass_empty_error

                }
                for (const osm_element of overpass_data['elements']) {
                    if (osm_element.type == "node") {
                        stop_tags = osm_element.tags
                        stop_id = osm_element.id
                    }
                    if (osm_element.type == "relation") {
                        if (osm_element.tags.type == "route") {
                            routes_at_stop.push({
                                "route_id": osm_element.id,
                                "tags": osm_element.tags,
                            })
                        }

                    }

                }
                return 'ok'
            } catch (error) {
                console.error(error)
                return "Oops, something went wrong"
            }
        }
    }
}());

var ferry_stop_data = (function () {
    var stop_tags;
    var stop_id;
    var routes_at_stop;

    return {
        get_tags: function () {
            return stop_tags;
        },
        get_osm_id: function () {
            return stop_id;
        },
        get_routes: function () {
            return routes_at_stop;
        },
        /**
         * fetch and process data
         * return a status
         */
        init_from_overpass: async function (latitude, longitude) {
            try {
                stop_tags = {}
                stop_id = ""
                routes_at_stop = []

                const stop_detail_url = `${overpass_base_url}[out:json];(node["amenity"="ferry_terminal"](around:5,${latitude},${longitude});)->.a;relation(bn);out tags;.a out;`;

                const overpass_response = await fetch(stop_detail_url);
                const overpass_data = await overpass_response.json();

                if (overpass_data['elements'].length == 0) {
                    var overpass_empty_error = "Erreur à l'appel overpass : la réponse retournée ne contient pas d'éléments"
                    console.error(overpass_empty_error)
                    return overpass_empty_error

                }
                for (const osm_element of overpass_data['elements']) {
                    if (osm_element.type == "node") {
                        stop_tags = osm_element.tags
                        stop_id = osm_element.id
                    }
                    if (osm_element.type == "relation") {
                        if (osm_element.tags.type == "route") {
                            routes_at_stop.push({
                                "route_id": osm_element.id,
                                "tags": osm_element.tags,
                            })
                        }

                    }

                }
                return 'ok'
            } catch (error) {
                console.error(error)
                return "Oops, something went wrong"
            }
        }
    }
}());

var station_data = (function () {
    var station_tags;
    var station_id;

    return {
        get_tags: function () {
            return station_tags;
        },
        get_osm_id: function () {
            return station_id;
        },
        /**
         * fetch and process data
         * return a status
         */
        init_from_overpass: async function (latitude, longitude) {
            try {
                station_tags = {}
                station_id = ""

                const station_detail_url = `${overpass_base_url}[out:json];node["railway"="station"](around:2,${latitude},${longitude});out tags;`;

                const overpass_response = await fetch(station_detail_url);
                const overpass_data = await overpass_response.json();

                if (overpass_data['elements'].length == 0) {
                    var overpass_empty_error = "Erreur à l'appel overpass : la réponse retournée ne contient pas d'éléments"
                    console.error(overpass_empty_error)
                    return overpass_empty_error

                }
                for (const osm_element of overpass_data['elements']) {
                    if (osm_element.type == "node") {
                        station_tags = osm_element.tags
                        station_id = osm_element.id
                    }
                }
                return 'ok'
            } catch (error) {
                console.error(error)
                return "Oops, something went wrong"
            }
        }
    }
}());

var bus_station_data = (function () {
    var station_tags;
    var stops_at_station;
    var routes_at_station;
    var station_id;
    var station_type;

    return {
        get_tags: function () {
            return station_tags;
        },
        get_osm_id: function () {
            return station_id;
        },
        get_osm_type: function () {
            return station_type;
        },
        get_stops: function () {
            return stops_at_station;
        },
        get_routes: function () {
            return routes_at_station;
        },
        /**
         * fetch and process data
         * return a status
         */
        init_from_overpass: async function (latitude, longitude) {
            try {
                station_tags = {}
                station_id = ""
                station_type = ""
                stops_at_station = []
                routes_at_station = []

                const station_detail_url = `${overpass_base_url}[out:json];(wr["amenity"="bus_station"](around:300,${latitude},${longitude}););map_to_area->.station;(node["highway"="bus_stop"](area.station);)->.stops;relation["route"="bus"](bn);out;.stops out;.station out tags;`;

                const overpass_response = await fetch(station_detail_url);
                const overpass_data = await overpass_response.json();

                if (overpass_data['elements'].length == 0) {
                    var overpass_empty_error = "Erreur à l'appel overpass : la réponse retournée ne contient pas d'éléments"
                    console.error(overpass_empty_error)
                    return overpass_empty_error

                }
                for (const osm_element of overpass_data['elements']) {
                    if (osm_element.tags.amenity == "bus_station") {
                        station_tags = osm_element.tags
                        station_id = osm_element.id
                        station_type = osm_element.type
                    }
                    if (osm_element.type == "node") {
                        if (osm_element.tags.highway == "bus_stop") {
                            stops_at_station.push({
                                "stop_id": osm_element.id,
                                "tags": osm_element.tags,
                            })
                        }
                    }
                    if (osm_element.type == "relation") {
                        if (osm_element.tags.type == "route") {
                            routes_at_station.push({
                                "route_id": osm_element.id,
                                "tags": osm_element.tags,
                            })
                        }

                    }
                }
                return 'ok'
            } catch (error) {
                console.error(error)
                return "Oops, something went wrong"
            }
        }
    }
}());

var platform_data = (function () {
    var platform_tags;
    var platform_id;
    var routes_at_platform;

    return {
        get_tags: function () {
            return platform_tags;
        },
        get_osm_id: function () {
            return platform_id;
        }, //TODO object type too
        get_routes: function () {
            return routes_at_platform;
        },
        /**
         * fetch and process data
         * return a status
         */
        init_from_overpass: async function (latitude, longitude) {
            try {
                platform_tags = {}
                platform_id = ""
                routes_at_platform = []

                const platform_detail_url = `${overpass_base_url}[out:json];(wr["railway"="platform"](around:50,${latitude},${longitude});)->.a;relation(bn);out tags;.a out;`;

                const overpass_response = await fetch(platform_detail_url);
                const overpass_data = await overpass_response.json();

                if (overpass_data['elements'].length == 0) {
                    var overpass_empty_error = "Erreur à l'appel overpass : la réponse retournée ne contient pas d'éléments"
                    console.error(overpass_empty_error)
                    return overpass_empty_error

                }
                for (const osm_element of overpass_data['elements']) {
                    if (osm_element.tags.railway == "platform") {
                        platform_tags = osm_element.tags
                        platform_id = osm_element.id
                    }
                    if (osm_element.type == "relation") {
                        if (osm_element.tags.type == "route") {
                            routes_at_platform.push({
                                "route_id": osm_element.id,
                                "tags": osm_element.tags,
                            })
                        }

                    }

                }
                return 'ok'
            } catch (error) {
                console.error(error)
                return "Oops, something went wrong"
            }
        }
    }
}());