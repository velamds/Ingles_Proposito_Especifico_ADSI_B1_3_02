//INICIO VARIABLES GENERALES
var descripcion = "Click on the cards. Answer each question to win.";
var control_de_tiempo = "180";
var numero_de_preguntas = 5;
var numero_de_intentos = 2;
var puntaje = "1";
var puntaje_actual = "0";
var exito_puntaje = "5";
var preguntas_txt = '{"preguntas":[{"id_pregunta":"1","pregunta":"Cutting-edge technology is supposed to be about...","respuestas":[{"tipo":"texto","respuesta":"technological devices, techniques or achievements.","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"providers that use the most updating and high-level information technology developments.","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"computing services such as clouds.","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"Innovation to advance","correcta":"no","seleccionada":"no"},{"id_pregunta":"2","pregunta":"One of the advantages of clouds is supposed to be…","respuestas":[{"tipo":"texto","respuesta":"technological devices, techniques, or achievements.","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"the ability to share data more easily.","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"computing services such as clouds.","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"Clouds are very useful for companies.","correcta":"no","seleccionada":"no"},{"id_pregunta":"3","pregunta":"Flexibility is supposed to be related to anytime and anywhere access and that means:","respuestas":[{"tipo":"texto","respuesta":"We do our bodies more elastic.","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"We can access to the cloud no matter the place or the time.","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"The ability to share data more easily.","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"You can open your files in Chine and Nicaragua at the same time.","correcta":"no","seleccionada":"no"},{"id_pregunta":"4","pregunta":"When we talk about high-level security it is supposed to be an indicator that…","respuestas":[{"tipo":"texto","respuesta":"our data is safe","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"clouds have weak security protocols","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"technological devices, techniques or achievements","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"Clouds have strong security protocols.","correcta":"no","seleccionada":"no"},{"id_pregunta":"5","pregunta":"We can say that by using clouds a company is saving money because…","respuestas":[{"tipo":"texto","respuesta":"of the ability to share data more easily.","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"the company reduces cost of equipment, infrastructure, and software.","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"we do our information more elastic.","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"A cloud stores a lot of data.","correcta":"no","seleccionada":"no"}]}';
//FIN VARIABLES GENERALES

//VARIABLES DE LA ACTIVIDAD
var preguntas_json = eval("(" + preguntas_txt + ")");
var preguntas_realizadas = new Array();
var pregunta_actual;
var intento_actual = 1;

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
    $('#modalPregunta').remove();
    $('#cont_puntos').html("0");
    pregunta_actual = 1;
    inicializa_iconos_preguntas();
    preguntas_json.preguntas.mezclar_preguntas();
    siguiente_pregunta();
    activar_contenedor('cont_actividad');
    activar_cronometro();
}

/*INICIO FUNCIONES PUNTUALES ACTIVIDAD*/
function siguiente_pregunta() {
    var siguiente_pregunta = '<span class="numero_de_pregunta_trivia">' + pregunta_actual + '</span> ' + preguntas_json.preguntas[pregunta_actual - 1].pregunta;
    if (preguntas_json.preguntas[pregunta_actual - 1].pista !== '') {
        siguiente_pregunta += '<img onclick="interactuar_con_pista(' + pregunta_actual + ');" id="trigger_pista_' + pregunta_actual + '" class="pista_pregunta" alt="Pista" src="../assets/img/pista_ico.png">';
        $('#actividad_pista').html('<p class="pista" id="pista_' + pregunta_actual + '" style="display: none;" >' + preguntas_json.preguntas[pregunta_actual - 1].pista + '</p>');
    }
    preguntas_json.preguntas[pregunta_actual - 1].respuestas.mezclar_respuestas();
    var html_preguntas = '';
    for (var i = 0; i < preguntas_json.preguntas[pregunta_actual - 1].respuestas.length; i++) {
        var vocal;
        if (i === 0) {
            vocal = 'a';
        } else if (i === 1) {
            vocal = 'b';
        } else if (i === 2) {
            vocal = 'c';
        } else if (i === 3) {
            vocal = 'd';
        } else if (i === 4) {
            vocal = 'e';
        } else if (i === 5) {
            vocal = 'f';
        } else if (i === 6) {
            vocal = 'g';
        } else if (i === 7) {
            vocal = 'h';
        } else if (i === 8) {
            vocal = 'i';
        } else if (i === 9) {
            vocal = 'j';
        } else if (i === 10) {
            vocal = 'k';
        }
        var style_border_bottom = "";
        if (i == (preguntas_json.preguntas[pregunta_actual - 1].respuestas.length - 1)) {
            style_border_bottom = "style=\"border-bottom: solid 4px #0a4c5e !important;border-radius: 0 0 20px 20px !important;\"";
        }
        html_preguntas += '<div ' + style_border_bottom + ' class="activador_respuesta_trivia" onclick="activar_respuesta_popup(' + i + ');" id="trivia_respuesta_' + (i + 1) + '"><div class="radio_button_pregunta_trivia" id="pregunta_radio_' + i + '"></div><div class="option_pregunta_trivia" id="pregunta_txt_' + i + '"><span class="trivia_letra_respuesta">' + vocal + '.</span>&nbsp;<span class="trivia_respuesta">' + preguntas_json.preguntas[pregunta_actual - 1].respuestas[i].respuesta + '</span></div></div>';
    }
    $('#cont_preguntas_actividad').html(html_preguntas);
    $('#titulo_txt_pregunta').html(siguiente_pregunta);
    $('#respuesta_seleccionada').val('-1');
    $('#trivia_btn_aceptar').css('display', 'none');
    ocultar_mensaje_de_informacion();
}
function activar_respuesta_popup(id_popup) {
    for (var i = 0; i < preguntas_json.preguntas[pregunta_actual - 1].respuestas.length; i++) {
        if (i === id_popup) {
            $('#pregunta_txt_' + i).css('background-color', '#bfb4d4');
            $('#pregunta_txt_' + i).css('font-weight', 'bold');
        } else {
            $('#pregunta_txt_' + i).css('background-color', '#FFF');
            $('#pregunta_txt_' + i).css('font-weight', 'normal');
        }
    }
    $('#respuesta_seleccionada').val(id_popup);
    $('#trivia_btn_aceptar').css('display', 'block');
}
function responder_pregunta() {
    if (preguntas_json.preguntas[pregunta_actual - 1].respuestas[($('#respuesta_seleccionada').val())].es_correcta === 'si') {
        preguntas_json.preguntas[pregunta_actual - 1].correcta = 'si';
        activar_estrella(pregunta_actual, 'exito');
        puntaje_actual = parseInt(puntaje_actual) + parseInt(puntaje);
        $('#cont_puntos').html(parseInt(puntaje_actual));
    } else {
        preguntas_json.preguntas[pregunta_actual - 1].correcta = 'no';
        activar_estrella(pregunta_actual, 'fallo');
    }
    preguntas_json.preguntas[pregunta_actual - 1].respuestas[($('#respuesta_seleccionada').val())].seleccionada = 'si';
    if (pregunta_actual === numero_de_preguntas) {
        activar_contenedor('cont_resultados');
        parar_cuenta_regresiva();
        armar_resultados();
    } else {
        pregunta_actual++;
        siguiente_pregunta();
    }
}
/*FIN FUNCIONES PUNTUALES ACTIVIDAD*/

/*DE ACA EN ADELANTE ESTAN LAS FUNCIONES GENERICAS*/
function mostrar_mensaje_de_informacion(mensaje_a_mostrar) {
    $('#cont_mensaje_interno_txt').html(mensaje_a_mostrar);
    $('#ahogado_actividad').css('display', 'none');
    $('#cont_mensaje_interno').fadeIn(1500);
}
function ocultar_mensaje_de_informacion() {
    $('#ahogado_actividad').css('display', 'block');
    $('#cont_mensaje_interno').css('display', 'none');
}
function reintentar() {
    preguntas_realizadas = new Array();
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
    } else {
        preguntas_json.preguntas[pregunta_actual - 1].correcta = 'si';
    }
    preguntas_realizadas.push(preguntas_json.preguntas[pregunta_actual - 1]);
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

function armar_resultados() {
    ocultar_modal('modalPreguntaTrivia');
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
    var tu_respuesta;
    var respuesta_correcta;
    var class_respuesta;
    var imagen_respuesta;
    if (preguntas_realizadas.length > 0) {
        for (var i = 0; i < preguntas_realizadas.length; i++) {
            resultados += '<div class="cont_pregunta">';
            resultados += '<p class="numero_pregunta">' + preguntas_realizadas[i].pregunta + '</p>';
            for (var j = 0; j < preguntas_realizadas[i].respuestas.length; j++) {
                if (preguntas_realizadas[i].respuestas[j].seleccionada === 'si') {
                    tu_respuesta = preguntas_realizadas[i].respuestas[j].respuesta;
                }
                if (preguntas_realizadas[i].respuestas[j].es_correcta === 'si') {
                    respuesta_correcta = preguntas_realizadas[i].respuestas[j].respuesta;
                }
            }
            if (preguntas_realizadas[i].correcta === 'si') {
                class_respuesta = 'txt_respuesta_correcta';
                imagen_respuesta = 'estrella_exito.png';
            } else {
                class_respuesta = 'txt_respuesta_incorrecta';
                imagen_respuesta = 'estrella_fallo.png';
            }
            resultados += '<p class="subtitulo_respuesta_txt">Your answer:&nbsp;&nbsp;<span class="' + class_respuesta + '">' + tu_respuesta + '</span></p>';
            resultados += '<p class="subtitulo_respuesta_txt">Correct answer:&nbsp;&nbsp;<span>' + respuesta_correcta + '</span></p>';
            if (preguntas_realizadas[i].justificacion !== '') {
                resultados += '<p class="subtitulo_respuesta_txt">Justificaci&oacute;n: <span class="justificacion">' + preguntas_realizadas[i].justificacion + '</span></p>';
            }
            resultados += '<img src="../assets/img/' + imagen_respuesta + '" alt="Imagen"/>';
            resultados += '</div>';
        }
    } else {
        resultados = '<div style="font-size:xx-large;text-align:center;"><span id="cantidad_intentos_restantes">The time is over and there are no more attempts.</span></div>';
    }
    return resultados;
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

Array.prototype.mezclar_preguntas = function () {
    var m = this.length - 1;
    for (var i = m; i > 1; i--) {
        var alea = Math.floor(i * Math.random());
        var temp = this[i];
        this[i] = this[alea];
        this[alea] = temp;
    }
};
Array.prototype.mezclar_respuestas = function () {
    var m = this.length - 1;
    for (var i = m; i > 1; i--) {
        var alea = Math.floor(i * Math.random());
        var temp = this[i];
        this[i] = this[alea];
        this[alea] = temp;
    }
};

$(window).load(setTimeout(inicializar_reglas_actividad(), 1000));