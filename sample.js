
function extract_date(time_el) {
    return time_el.match(/[^T]*/);
}

function get_average(arr) {
    return parseFloat(arr.reduce((x,y) => x + y )) / parseFloat(arr.length);
}

function make_temp_obj(timesg, tempsg) {
    let new_object = {};
    for (let i = 0; i < timesg.length; i++) {
        const exdate = extract_date(timesg[i]);
        if ( !(exdate in new_object) ) {
            new_object[exdate] = [];
        }
        new_object[exdate].push(tempsg[i]);
    }
    return new_object;
}

function reg_text_insert(day, value, col) {
    //Elements
    const temp_comp = document.querySelector( '[id=weather-' + day + '-temp]'   );
    const svg_comp  = document.querySelector( '[id=weather-' + day + '-svg]'    );
    const cir_comp  = document.querySelector( '[id=weather-' + day + '-circle]' );

    temp_comp.innerHTML = value;
    cir_comp.setAttribute("fill", col);
}

function temp_in_html() {
    const jsong     = JSON.parse(this.responseText);
    const timesg    = jsong["hourly"]["time"];
    const tempsg    = jsong["hourly"]["temperature_2m"];
    const weekdays  = {1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday"};
    const weekends  = {"Sundays": 0, "Saturdays": 6};
    const temp_obj  = make_temp_obj(timesg, tempsg);

    let newbie_folk = {"Monday": null, "Tuesday": null, "Wednesday": null, "Thursday": null, "Friday": null};

    for (const key in temp_obj) {

        const c_date = new Date(key);
        const day_num = c_date.getDay();
        const tnum = temp_obj[key];

        if (day_num in weekdays) {
            const avr = get_average(tnum);
            const rnded = Math.round(avr);
            const col = rnded > 2 ? "#FFC600" : "#3399FF";

            newbie_folk[weekdays[day_num]] = {"Average": avr, "Temps": tnum};
            reg_text_insert(weekdays[day_num].toLowerCase(), rnded.toString() + '&#176;', col); 
        }
    }
}

function main() {

    const latit =  '39.6329'
    const longi = '-86.1655'

    //          protocol     domain                 suburl
    const murl = 'https://' + 'api.open-meteo.com' + '/v1/forecast' +
                 '?' + 'latitude'        + '=' +           latit  +
                 '&' + 'longitude'       + '=' +           longi  +
                 '&' + 'hourly'          + '=' + 'temperature_2m' + 
                 '&' + 'current_weather' + '=' +           'true' ;

    const req = new XMLHttpRequest();

    req.open(method="GET", URL=murl, ASYNC=true);
    req.onload = temp_in_html;
    req.send();
}

document.addEventListener("DOMContentLoaded", main);

