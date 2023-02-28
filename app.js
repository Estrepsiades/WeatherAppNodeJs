require('dotenv').config()
require('colors');
const { inquirerMenu, inquirerPause, readInput, listarLugares } = require("./helpers/inquirer");
const Busquedas = require('./models/busquedas');

const main = async() => {
    const busquedas = new Busquedas();
    let opt = '';

    do{

        opt = await inquirerMenu()

        switch( opt ){
            case 1:
                //Mostrar Mensaje
                const busqueda = await readInput('Ciudad: ')
                
                //Buscar Los Lugares
                const lugares = await busquedas.ciudad( busqueda );
             
                //Seleccionar Lugar
                const id = await listarLugares( lugares );
                if( id === '0' ) continue;
                const lugarSel = lugares.find( l => l.id === id );
                //Mandar a Db
                busquedas.agregarHistorial( lugarSel.nombre );

                //Clima
                const clima = await busquedas.climaLugar( lugarSel.lng, lugarSel.lat );
                //Mostrar Resultados
                console.clear();
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre );
                console.log('Latitud:', lugarSel.lat );
                console.log('Longitud:', lugarSel.lng );
                console.log('Temperatura:', clima.tempAct );
                console.log('Minima:', clima.tempMin );
                console.log('Maxima:', clima.tempMax );
                console.log('Como esta el clima: ', clima.desc.green );
                break;
            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i ) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log(`${idx} ${ lugar }`);
                })
                break;
        };

        await inquirerPause();
    }while( opt !== 0 )


};

main();