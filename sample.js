
function extract_date(time_el) {
    return time_el.match(/^.+(?=T)/);
}

function get_average(arr) {
    return parseFloat(arr.reduce((x,y) => x + y )) / parseFloat(arr.length);
}

function extract_num(str_date) {
    const cfun = str_date
        .match( /(?<=[^0-9]|^)[0-9]+(?=[^0-9]|$)/g );
    return cfun.map( (x) => parseInt(x) );
}

function make_temp_obj(timesg, tempsg) {
    let new_object = {};
    for (let i = 0; i < timesg.length; i++) {
        const exdate = extract_date(timesg[i]);
        if ( !(new_object.hasOwnProperty(exdate)) ) {
            new_object[exdate] = [];
        }
        new_object[exdate].push(tempsg[i]);
    }
    return new_object;
}

function reg_text_insert(day, value, col) {
    const temp_comp = document.querySelector( '[id=weather-' + day + '-temp]'   );
    const cir_comp  = document.querySelector( '[id=weather-' + day + '-circle]' );

    temp_comp.innerHTML = value;
    cir_comp.setAttribute("fill", col);
}

function temp_in_html() {
    const jsong     = JSON.parse(this.responseText);
    const timesg    = jsong["hourly"]["time"];
    const tempsg    = jsong["hourly"]["temperature_2m"];
    const weekdays  = {1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday"};
    const temp_obj  = make_temp_obj(timesg, tempsg);

    Object.entries(temp_obj)
    .forEach( ([key, value]) => {

        const gt = extract_num(key);
        const day_num = (new Date(gt[0], gt[1] - 1, gt[2])).getDay();

        if (weekdays.hasOwnProperty(day_num)) {
            console.log(day_num, key, value);
            const rnded = Math.round(get_average(value));
            const col = rnded > 2 ? "#FFC600" : "#3399FF";
            reg_text_insert(weekdays[day_num].toLowerCase(), rnded.toString() + '&#176;', col); 
        }
    });
}

function main() {
    const req = new XMLHttpRequest();
    const latit =  '39.632927'
    const longi = '-86.16553'
    const murl = 'https://' + 'api.open-meteo.com' + '/v1/forecast' +
                 '?' + 'latitude'        + '=' +           latit  +
                 '&' + 'longitude'       + '=' +           longi  +
                 '&' + 'hourly'          + '=' + 'temperature_2m' + 
                 '&' + 'timezone'        + '=' +           'auto' +
                 '&' + 'current_weather' + '=' +           'true' ;

    req.open(method="GET", URL=murl, ASYNC=true);
    req.onload = temp_in_html;
    req.send();
}

document.addEventListener("DOMContentLoaded", main);

