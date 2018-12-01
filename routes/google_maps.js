

const _ = require('lodash');
const googleMapsClient = require('@google/maps');

class GoogleMapsService {
    constructor() {
        this.googleMapsClient = googleMapsClient.createClient({
            key: 'AIzaSyD5VRuLazKNnJ3QJMkKQPMDOyafN_njSvs',
            clientId: 'gme-4move',
        });
    }

    directions(origin, destination, mode = 'driving') {
        return new Promise((resolve, reject) => {
            this.googleMapsClient.directions({
                origin,
                mode,
                destination,
                language: 'pt-BR',
                traffic_model: 'optimistic',
                departure_time: 'now',
            }, (error, response) => {
                if (!error) resolve(response);
                if (error) reject(error);
            });
        });
    }

    distanceAndDuration(origin, destination, directionsAvoid, directionsTrafficModel) {
        console.log('Fui executado');
        return new Promise((resolve, reject) => {
            this.directions(origin, destination, directionsAvoid, directionsTrafficModel)
                .then((data) => {
                    const routes = data.json.routes;

                    if (_.size(routes) < 1) {
                        reject(new Error('ZERO_RESULTS'));
                        return;
                    }

                    const durationInSeconds = routes[0].legs[0].duration.value || 0.0;
                    const distanceInMeters = routes[0].legs[0].distance.value || 0.0;
                    const kmInMeters = 1000;
                    const hourInMinutes = 60;

                    const durationInMinutes = parseFloat(durationInSeconds / hourInMinutes).toFixed(2);
                    const distanceInKilometer = parseFloat(distanceInMeters / kmInMeters).toFixed(2);

                    resolve({
                        distance: parseFloat(distanceInKilometer),
                        duration: parseFloat(durationInMinutes),
                    });
                }).catch((error) => {
                    reject(error);
                });
        });
    }
}

module.exports = GoogleMapsService;
