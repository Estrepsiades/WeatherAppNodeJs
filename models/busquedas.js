const fs = require('fs');

const axios = require('axios');

class Busquedas{

    historial = [];
    dbpath = './db/database.json';

    constructor(){

        this.leerDb();

    };

    get historialCapitalizado(){
        return this.historial.map( lugar => {

            let palabras = lugar.split('');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );

            return palabras.join('');


        });
    }

    get paramsMapBox(){
        return{
            'access_token' : process.env.MAPBOX_KEY,
            'limit' : 5,
            'language' : 'es',
        };
    };

    get paramsOpenWeather(){
        return{
            'units': 'metric',
            'lang' : 'es'
        };
    }

    async ciudad( lugar = '' ){
        //Peticion Htpp

        //console.log(`TIPO ${ typeof( lugar )}`)
        //console.log( lugar )
        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapBox
            });

            const resp = await instance.get();

            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name_es,
                lng: lugar.center[0],
                lat: lugar.center[1],

            })) 
            
        } catch (error) {

            console.log( error );
            return [];

        }
  

        //Retorna 6 Ciudades
    };

    async climaLugar( lon, lat ){
        try {

            const instance = axios.create({
                baseURL:
                `https://api.openweathermap.org/data/2.5/weather?lat=${ lat }&lon=${ lon }&appid=${process.env.OPENWATHER_KEY}`,
                params: this.paramsOpenWeather
            });

            const resp = await instance.get();

            return ({
                desc: resp.data.weather[0].description,
                tempAct: resp.data.main.temp,
                tempMax: resp.data.main.temp_max,
                tempMin: resp.data.main.temp_min,
            });

            //console.log( resp.data )
            
        } catch (error) {
            console.log( error );
        }
    };

    agregarHistorial( lugar ) {
        //Prevenir 
        
        if( this.historial.includes( lugar.toLocaleLowerCase() )){
            return
        }
        
        //Grabar en 
        this.historial.unshift( lugar.toLocaleLowerCase() );
        this.guardarDb()

    };

    guardarDb(){

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync( this.dbpath, JSON.stringify( payload ));


    }

    leerDb(){

        //Si existe
        if( this.dbpath ){
            const info = fs.readFileSync( this.dbpath, 'utf-8' );
            const data = JSON.parse( info );
            return this.historial = data.historial;
        }
    }

}

module.exports = Busquedas;