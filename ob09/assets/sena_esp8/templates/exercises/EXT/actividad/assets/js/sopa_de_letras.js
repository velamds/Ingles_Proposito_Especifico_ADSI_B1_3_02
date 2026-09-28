//INICIO VARIABLES GENERALES
var descripcion = "Read each word. Find it in the grid by clicking on each letter.";
var control_de_tiempo = "120";
var numero_de_preguntas = 1;
var numero_de_intentos = 2;
var puntaje = "1";
var puntaje_actual = "0";
var exito_puntaje = "1";
var preguntas_txt = '{"preguntas":[{"id_pregunta":"1","pregunta":"law","frase":"1","orientacion":"su","pos_x":"8","pos_y":"7","pista":""},{"id_pregunta":"2","pregunta":"own","frase":"1","orientacion":"su","pos_x":"6","pos_y":"5","pista":""},{"id_pregunta":"3","pregunta":"permission","frase":"1","orientacion":"or","pos_x":"0","pos_y":"3","pista":""},{"id_pregunta":"4","pregunta":"copyrights","frase":"1","orientacion":"or","pos_x":"0","pos_y":"0","pista":""},{"id_pregunta":"5","pregunta":"piracy","frase":"1","orientacion":"su","pos_x":"4","pos_y":"2","pista":""}]}';
//FIN VARIABLES GENERALES

//VARIABLES DE LA ACTIVIDAD
var preguntas_json = eval("(" + preguntas_txt + ")");
var intento_actual = 1;
var respondio_tablero = false;
var frase_actual;
var tablero_correcto;
var tablero_correcto_json;
var mi_tablero;
var mi_tablero_json;

if (navigator.userAgent.match("Chrome")) {
} else {
    $('.actividad_sopa_de_letras').css("top", "0").css("height", "100%");
}

var preguntas_json_original = eval("(" + preguntas_txt + ")");

/*INICIO FUNCIONES PUNTUALES ACTIVIDAD*/

function inicializar_reglas_actividad() {
    $('#cont_descripcion').html(descripcion);
    if (numero_de_preguntas > 1) {
        $('#cont_numero_de_preguntas').html('The activity is composed of ' + numero_de_preguntas + ' questions. This icon will change every time you answer each question.');
    } else {
        $('#cont_numero_de_preguntas').html('The activity is composed of ' + numero_de_preguntas + ' question. This icon will change every time you answer each question.');
    }
    if (numero_de_intentos > 1) {
        $('#cont_numero_de_intentos').html('You have ' + numero_de_intentos + ' attempts to successfully complete the activity.');
    } else {
        $('#cont_numero_de_intentos').html('You have ' + numero_de_intentos + ' attempt to successfully complete the activity.');
    }
    if (exito_puntaje > 1) {
        $('#cont_puntaje').html('To successfully complete this activity, you must get at least ' + exito_puntaje + ' points. Each correct answer gives ');
    } else {
        $('#cont_puntaje').html('To successfully complete this activity, you must get at least ' + exito_puntaje + ' point. Each correct answer gives ');
    }
    if (puntaje > 1) {
        $('#cont_puntaje').html($('#cont_puntaje').html() + ' ' + puntaje + ' points.');
    } else {
        $('#cont_puntaje').html($('#cont_puntaje').html() + ' ' + puntaje + ' point.');
    }
    msg_tiempo = 'This activity has no time limit.';
    if (control_de_tiempo !== '' && control_de_tiempo !== '0') {
        if (control_de_tiempo > 1) {
            msg_tiempo = 'You have  ' + control_de_tiempo + ' seconds to complete the activity.';
        } else {
            msg_tiempo = 'You have  ' + control_de_tiempo + ' second to complete the activity.';
        }
    }
    $('#cont_tiempo').html(msg_tiempo);
    logo_animation();
}

function inicializar_actividad() {
    preguntas_json = JSON.parse(JSON.stringify(preguntas_json_original));
    $('#btn_actividad_container').html('<button id="btn_acciones" onclick="responder_pregunta();" class="btn_actividad btn_enviar_morado">Submit</button>');
            inicializar_tablero();
    inicializar_clicks();
    $('#btn_acciones').css('display', 'block');
    $('#cont_puntos').html("0");
    frase_actual = 0;
    inicializa_iconos_preguntas();
    activar_contenedor('cont_actividad');
    activar_cronometro();
}

function inicializar_tablero() {
    tablero_correcto = '{"filas":[';
    mi_tablero = '{"filas":[';
    var coma;
    var tablero_html = '<table>';
    for (var i = 0; i < 10; i++) {
        tablero_correcto += '{"columnas":[';
        mi_tablero += '{"columnas":[';
        tablero_html += '<tr id="fila_' + i + '">';
        for (var j = 0; j < 10; j++) {
            coma = ',';
            if (j === 9) {
                coma = '';
            }
            var letra_al_azar = generar_letra_al_azar();
            tablero_correcto += '{"estado":"0","letra":"' + letra_al_azar + '"}' + coma;
            mi_tablero += '{"estado":"0","letra":"' + letra_al_azar + '"}' + coma;
            tablero_html += '<td id="posicion_' + i + '_' + j + '">' + letra_al_azar + '<input type="hidden" value="0" id="' + i + '-' + j + '"/></td>';
            $('posicion_' + i + '_' + j).click(function () {
                activar_desactivar_posicion(i, j);
            });
        }
        coma = ',';
        if (i === 9) {
            coma = '';
        }
        tablero_correcto += ']}' + coma;
        mi_tablero += ']}' + coma;
        tablero_html += '</tr>';
    }
    tablero_correcto += ']}';
    mi_tablero += ']}';
    tablero_correcto_json = eval("(" + tablero_correcto + ")");
    mi_tablero_json = eval("(" + mi_tablero + ")");
    tablero_html += '</table>';
    $('#contenedor_tablero').html(tablero_html);
    var preguntas_html = '';
    preguntas_html += '<ol>';
    for (var i = 0; i < preguntas_json.preguntas.length; i++) {
        var a_buscar = "";        
        if (preguntas_json.preguntas[i].pista !== '') {            
            a_buscar = preguntas_json.preguntas[i].pista;
        } else {
            a_buscar = preguntas_json.preguntas[i].pregunta.toUpperCase();            
        }        
        preguntas_html += '<li>' + a_buscar + '</li>';
        var incremento_x = preguntas_json.preguntas[i].pos_x;
        var incremento_y = preguntas_json.preguntas[i].pos_y;
        for (var j = 0; j < preguntas_json.preguntas[i].pregunta.length; j++) {
            $('#posicion_' + incremento_y + '_' + incremento_x).html(preguntas_json.preguntas[i].pregunta.charAt(j).toUpperCase() + '<input type="hidden" value="1" id="' + incremento_y + '-' + incremento_x + '"/>');
            tablero_correcto_json.filas[incremento_y].columnas[incremento_x].estado = "1";
            tablero_correcto_json.filas[incremento_y].columnas[incremento_x].letra = preguntas_json.preguntas[i].pregunta.charAt(j).toUpperCase();
            mi_tablero_json.filas[incremento_y].columnas[incremento_x].letra = preguntas_json.preguntas[i].pregunta.charAt(j).toUpperCase();
            switch (preguntas_json.preguntas[i].orientacion) {
                case 'no':
                    incremento_y--;
                    break;
                case 'su':
                    incremento_y++;
                    break;
                case 'or':
                    incremento_x++;
                    break;
                case 'oc':
                    incremento_x--;
                    break;
                case 'su_or':
                    incremento_y++;
                    incremento_x++;
                    break;
                case 'su_oc':
                    incremento_y++;
                    incremento_x--;
                    break;
                case 'no_or':
                    incremento_y--;
                    incremento_x++;
                    break;
                case 'no_oc':
                    incremento_y--;
                    incremento_x--;
                    break;
                default:
                    alert('ERROR!!! Contacte a su proveedor porque esta sopa de letras esta mal configurada.');
            }
        }
    }
    preguntas_html += '</ol>';
    $('#contenedor_palabras').html(preguntas_html);
}

function generar_letra_al_azar() {
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return possible.charAt(Math.floor(Math.random() * possible.length));
}

function inicializar_clicks() {
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            activar_desactivar_posicion(i, j);
        }
    }
}

function activar_desactivar_posicion(x, y) {
    $('#posicion_' + x + '_' + y).click(function () {
        if (mi_tablero_json.filas[x].columnas[y].estado === '1') {
            $('#posicion_' + x + '_' + y).css('background-color', 'transparent');
            $('#posicion_' + x + '_' + y).css('color', '#0e4b5e');
            $('#' + x + '-' + y).val('0');
            mi_tablero_json.filas[x].columnas[y].estado = "0";
        } else {
            $('#posicion_' + x + '_' + y).css('background-color', 'rgba(128,106,169,0.45)');
            $('#posicion_' + x + '_' + y).css('color', '#FFF');
            $('#' + x + '-' + y).val('1');
            mi_tablero_json.filas[x].columnas[y].estado = "1";
        }
    });
}

/*INICIO FUNCIONES PUNTUALES ACTIVIDAD*/
function responder_pregunta() {
    respondio_tablero = true;
    var los_tableros_son_iguales = true;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            if (mi_tablero_json.filas[i].columnas[j].estado !== tablero_correcto_json.filas[i].columnas[j].estado) {
                los_tableros_son_iguales = false;
            }
        }
    }    
    if (los_tableros_son_iguales) {
        activar_estrella(frase_actual, 'exito');
        puntaje_actual = parseInt(puntaje_actual) + parseInt(puntaje);
        $('#cont_puntos').html(parseInt(puntaje_actual));
    } else {
        activar_estrella(frase_actual, 'fallo');
    }
    activar_contenedor('cont_resultados');
    parar_cuenta_regresiva();
    armar_resultados();
}
function armar_resultados() {
    if (puntaje_actual >= exito_puntaje) {
        $('#txt_pagina_resultados').html('Success <img src="../assets/img/mano_arriba.png" alt="Success"/>');
        $('.resultados_preguntas').css('display', 'block');
        $('.resultados_preguntas').html(calcular_resultados());
        $('.cont_reintentar').css('display', 'none');
    } else {
        if (intento_actual === numero_de_intentos) {
            $('#txt_pagina_resultados').html('Failure <img src="../assets/img/mano_abajo.png" alt="Failure"/>');
            $('.resultados_preguntas').css('display', 'block');
            $('.resultados_preguntas').html(calcular_resultados());
            $('.cont_reintentar').css('display', 'none');
        } else {
            $('.resultados_preguntas').css('display', 'none');
            $('.cont_reintentar').css('display', 'block');
            if ((numero_de_intentos - intento_actual) > 1) {
                msg_intentos = "You have " + (numero_de_intentos - intento_actual) + " attempts left.";
            } else {
                msg_intentos = "You have 1 try.";
            }
            $('#cantidad_intentos_restantes').html(msg_intentos);
        }
    }
}
function calcular_resultados() {
    var resultados = '';
    if (respondio_tablero) {
        resultados += '<div class="contenedor_tablas_resultados">';
        resultados += armar_html_tablero_correcto();
        resultados += armar_html_mi_tablero();
        resultados += '</div>';
    } else {
        resultados = '<div style="font-size:xx-large;text-align:center;"><span id="cantidad_intentos_restantes">The time is over and there are no more attempts.</span></div>';
    }
    return resultados;
}
function armar_html_tablero_correcto() {
    var tablero_html = '<div class="contenedor_tablero_correcto">';
    tablero_html += '<div class="actividad_sopa_de_letras">';
    tablero_html += '<div class="contenedor_titulo_sopa_de_letras"><p class="titulo_resultados_sopa_de_letras">The correct board</p></div>';
    tablero_html += '<div class="actividad_sopa_de_letras">';
    tablero_html += '<div class="sopa_de_letras">';
    tablero_html += '<table>';
    for (var i = 0; i < 10; i++) {
        tablero_html += '<tr id="fila_' + i + '">';
        for (var j = 0; j < 10; j++) {
            if (tablero_correcto_json.filas[i].columnas[j].estado === '1') {
                tablero_html += '<td style="background-color:rgba(128,106,169,0.45);color:#FFF;">' + tablero_correcto_json.filas[i].columnas[j].letra + '</td>';
            } else {
                tablero_html += '<td>.</td>';
            }
        }
        tablero_html += '</tr>';
    }
    tablero_html += '</table></div></div></div></div>';
    return tablero_html;
}
function armar_html_mi_tablero() {
    var tablero_html = '<div class="contenedor_mi_tablero">';
    tablero_html += '<div class="actividad_sopa_de_letras">';
    tablero_html += '<div class="contenedor_titulo_sopa_de_letras"><p class="titulo_resultados_sopa_de_letras">Your board</p></div>';
    tablero_html += '<div class="actividad_sopa_de_letras">';
    tablero_html += '<div class="sopa_de_letras">';
    tablero_html += '<table>';
    for (var i = 0; i < 10; i++) {
        tablero_html += '<tr id="fila_' + i + '">';
        for (var j = 0; j < 10; j++) {
            if (mi_tablero_json.filas[i].columnas[j].estado === '1') {
                tablero_html += '<td style="background-color:rgba(128,106,169,0.45);color:#FFF;">' + mi_tablero_json.filas[i].columnas[j].letra + '</td>';
            } else {
                tablero_html += '<td>.</td>';
            }
        }
        tablero_html += '</tr>';
    }
    tablero_html += '</table></div></div></div></div>';
    return tablero_html;
}
/*FIN FUNCIONES PUNTUALES ACTIVIDAD*/

/*DE ACA EN ADELANTE ESTAN LAS FUNCIONES GENERICAS*/
function reintentar() {
    $('#cont_puntos').html("0");
    puntaje_actual = "0";
    intento_actual++;
    inicializar_actividad();
}

function activar_estrella(num_pregunta, estado) {
    var obj_pregunta = $('#pregunta_' + num_pregunta);
    var imagen = '../assets/img/estrella_exito.png';
    var titulo = "CORRECT";
    if (estado === 'fallo') {
        imagen = '../assets/img/estrella_fallo.png';
        titulo = "INCORRECT";
    }
    obj_pregunta.fadeOut(500, function () {
        obj_pregunta.attr("src", imagen);
        obj_pregunta.attr("title", titulo);
        obj_pregunta.fadeIn(500);
    });
}

function inicializa_iconos_preguntas() {
    var html_txt = '';
    for (var i = 1; i <= parseInt(numero_de_preguntas); i++) {
        html_txt += '<div class="pregunta_' + i + '"><img title="QUESTION ' + i + '" id="pregunta_' + i + '" src="../assets/img/estrella_turno_actual.png" alt="Icono"/></div>';
    }
    html_txt = '';
    $('.preguntas').html(html_txt);
}


function activar_contenedor(contenedor) {
    if (contenedor === 'cont_actividad') {
        $('#cont_actividad').fadeIn(1000);
        $('#inicio_actividad').fadeOut(1000);
        $('#cont_resultados').fadeOut(1000);
    } else if (contenedor === 'inicio_actividad') {
        $('#cont_actividad').fadeOut(1000);
        $('#inicio_actividad').fadeIn(1000);
        $('#cont_resultados').fadeOut(1000);
    } else if (contenedor === 'cont_resultados') {
        $('#cont_actividad').fadeOut(1000);
        $('#inicio_actividad').fadeOut(1000);
        $('#cont_resultados').fadeIn(1000);
    } else {
        console.log('ERROR GARRAFAL. NO LLEGO TIPO DE CONTENEDOR. CONTACTE AL PROVEEDOR DEL SOFTWARE.');
        return false;
    }
}

function perdio_por_tiempo() {
    activar_contenedor('cont_resultados');
    armar_resultados();
}

/*INICIO FUNCIONES DEL CRONOMETRO*/
function activar_cronometro() {
    if (control_de_tiempo > 0) {
        $('.tiempo_actividad').css('display', 'block');
        inicio_cuenta_regresiva(control_de_tiempo);
    } else {
        $('.tiempo_actividad').css('display', 'none');
    }
}
function inicio_cuenta_regresiva(control_de_tiempo) {
    if (typeof control !== 'undefined') {
        reinicio_cuenta_regresiva(control_de_tiempo);
    } else {
        segundos = control_de_tiempo;
        control = setInterval(cuenta_regresiva, 1000);
    }
}
function parar_cuenta_regresiva() {
    if (control_de_tiempo > 0) {
        clearInterval(control);
    }
}
function reinicio_cuenta_regresiva(control_de_tiempo) {
    clearInterval(control);
    segundos = control_de_tiempo;
    $('#cont_segundos').html(segundos);
    control = setInterval(cuenta_regresiva, 1000);
}
function cuenta_regresiva() {
    $('#cont_segundos').html(segundos);
    if (segundos === 0) {
        parar_cuenta_regresiva();
        perdio_por_tiempo();
    } else {
        segundos--;
    }
}
/*FIN FUNCIONES DEL CRONOMETRO*/

$(window).load(setTimeout(inicializar_reglas_actividad(), 1000));
