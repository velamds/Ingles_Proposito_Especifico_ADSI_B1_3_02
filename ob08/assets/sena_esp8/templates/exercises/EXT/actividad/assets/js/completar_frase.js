//INICIO VARIABLES GENERALES
var descripcion = "“Complete the idea and review your knowledge!";
var control_de_tiempo = "250";
var numero_de_preguntas = 5;
var numero_de_intentos = 2;
var puntaje = "1";
var puntaje_actual = "0";
var exito_puntaje = "5";
var preguntas_txt = '{"preguntas":[{"id_pregunta":"1","pregunta":"Well, the warranty section in a contract is important because it","respuestas":[{"tipo":"texto","respuesta":"is supposed showing","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"is supposed to show","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"has supposed","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no","frase":"1"},{"id_pregunta":"2","pregunta":"Also, this","respuestas":[{"tipo":"texto","respuesta":"section is supposed to","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"sections are supposed to","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"section was supposed to","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no","frase":"2"},{"id_pregunta":"3","pregunta":"Remember that a warranty section is really important, as","respuestas":[{"tipo":"texto","respuesta":"it is supposed","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"she supposed","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"it is supposing","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no","frase":"3"},{"id_pregunta":"4","pregunta":"You really need to ask for this section, as it is supposed ","respuestas":[{"tipo":"texto","respuesta":"telling you","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"to tell it","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"to tell you","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no","frase":"4"},{"id_pregunta":"5","pregunta":"So, a software contract needs to have a warranty section because","respuestas":[{"tipo":"texto","respuesta":"it is supposed to assist","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"It supposing to assist","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"it supposed to assist","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no","frase":"5"}],"frases_finales":[{"frase":"1","texto_final":"what the specific software will do."},{"frase":"2","texto_final":"negotiate the performance of the software and determine the responsibilities of the licensor."},{"frase":"3","texto_final":"to help you avoid detrimental effects of your software."},{"frase":"4","texto_final":"about all the factors that can affect the software you get."},{"frase":"5","texto_final":"you with any possible issues in your software"}]}';
//FIN VARIABLES GENERALES

//VARIABLES DE LA ACTIVIDAD
var preguntas_json = eval("(" + preguntas_txt + ")");
var preguntas_realizadas = new Array();
var mis_respuestas = new Array();
var frase_actual;
var intento_actual = 1;
var letras_a_encontrar;
var k = 1;
var l = 1;
var preguntas_json_original = eval("(" + preguntas_txt + ")");

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

/*INICIO FUNCIONES PUNTUALES ACTIVIDAD*/
function inicializar_actividad() {
    preguntas_json = JSON.parse(JSON.stringify(preguntas_json_original));
    $('#btn_acciones').css('display', 'block');
    $('#cont_puntos').html("0");
    $('#btn_actividad_container').html('<button id="btn_acciones" onclick="responder_pregunta();" class="btn_actividad btn_enviar_morado">Submit</button>');
    frase_actual = 1;
    inicializa_iconos_preguntas();
    //preguntas_json.preguntas.mezclar_preguntas();
    siguiente_pregunta();
    activar_contenedor('cont_actividad');
    activar_cronometro();
}

/*INICIO FUNCIONES PUNTUALES ACTIVIDAD*/
function siguiente_pregunta() {
    var siguiente_pregunta = armar_la_frase(frase_actual);
    $('#la_frase').html(siguiente_pregunta);
    $('#btn_responder_pregunta').css('display', 'none');
    ocultar_mensaje_de_informacion();
}
function armar_la_frase(frase) {
    k = 1;
    l = 1;
    $('#cont_preguntas').html('');
    $('#cont_respuestas').html('');
    $('#cont_preguntas').html(armar_preguntas(frase));
    for (var i = 1; i <= preguntas_json.preguntas.length; i++) {
        $("#cont_respuesta_" + parseInt(preguntas_json.preguntas[(i - 1)].id_pregunta)).droppable({
            hoverClass: "ui-state-active",
            drop: function (event, ui) {
                var id = ui.draggable.attr("id");
                var partes_origen = id.split('respuesta_');
                var partes_destino = $(this).attr("id").split('cont_respuesta_');
                asignar_valores(partes_origen[1], partes_destino[1]);
                $(this).append(ui.draggable.css('position', 'static'));
                $(this).append(ui.draggable.css('width', '100%'));
                $(this).append(ui.draggable.css('margin', '0'));
                $(this).droppable("destroy");
                ui.draggable.draggable("destroy");
            }
        });
        for (var j = 1; j <= preguntas_json.preguntas[(i - 1)].respuestas.length; j++) {
            $("#respuesta_" + k).css('cursor', 'crosshair');
            $("#respuesta_" + k).draggable({
                revert: "invalid"
            });
            k++;
        }
    }
}
function asignar_valores(origen, destino) {
    $('#vd_' + destino).val($('#vo_' + origen).val());
    $('#cont_respuesta_' + destino).css('border-color', '#03b1bc');
    $("#respuesta_" + origen).draggable({
        disabled: true
    });
    $("#respuesta_" + origen).css('cursor', 'default');
}
function armar_preguntas(frase) {
    var preguntas = '';
    for (var i = 0; i < preguntas_json.preguntas.length; i++) {
        if (parseInt(frase) === parseInt(preguntas_json.preguntas[i].frase)) {
            preguntas += '<span id="txt_pregunta_' + parseInt(preguntas_json.preguntas[i].id_pregunta) + '" class="pregunta_span">' + preguntas_json.preguntas[i].pregunta + '</span>';
            preguntas += '<div id="cont_respuesta_' + parseInt(preguntas_json.preguntas[i].id_pregunta) + '" class="comp_frase_block">';
            preguntas += '<input type="hidden" value="" id="vd_' + parseInt(preguntas_json.preguntas[i].id_pregunta) + '"/>';
            preguntas += '</div>';
            $('#cont_respuestas').append(armar_respuestas(preguntas_json.preguntas[i]));
        }
    }
    preguntas += '<span class="pregunta_span">' + armar_final_de_frase(frase) + '</span>';
    return preguntas;
}
function armar_final_de_frase(frase) {
    frase_final = '';
    for (var o = 0; o < preguntas_json.frases_finales.length; o++) {
        if (parseInt(frase) === parseInt(preguntas_json.frases_finales[o].frase)) {
            frase_final = preguntas_json.frases_finales[o].texto_final;
        }
    }
    return frase_final;
}
function armar_respuestas(pregunta) {
    pregunta.respuestas.mezclar_respuestas();
    var respuestas = '';
    for (var i = 1; i <= pregunta.respuestas.length; i++) {
        respuestas += '<div class="cont_respuesta_completar_frase" id="respuesta_' + l + '">';
        respuestas += '<span>' + pregunta.respuestas[(i - 1)]['respuesta'] + '</span>';
        respuestas += '<input type="hidden" value="' + pregunta.respuestas[(i - 1)]['respuesta'] + '" id="vo_' + l + '"/>';
        respuestas += '</div>';
        l++;
    }
    return respuestas;
}
function responder_pregunta() {
    var error_color = '#a01e2b';
    var falta_responder_selects = false;
    for (var i = 1; i <= preguntas_json.preguntas[frase_actual - 1].respuestas.length; i++) {
        if ($('#vd_' + i).val() === '') {
            $('#cont_respuesta_' + i).css('border-color', error_color);
            falta_responder_selects = true;
        }
    }
    if (falta_responder_selects) {
        return false;
    } else {
        validar_la_frase();
    }
}
function validar_la_frase() {
    var todas_las_respuestas_de_la_frase_son_correctas = true;
    var mis_respuestas_detalladas = new Array();
    for (var i = 0; i < preguntas_json.preguntas.length; i++) {
        if (parseInt(frase_actual) === parseInt(preguntas_json.preguntas[i].frase)) {
            if (!validar_respuestas_pregunta_frase(mis_respuestas_detalladas, preguntas_json.preguntas[i])) {
                todas_las_respuestas_de_la_frase_son_correctas = false;
            }
        }
    }
    mis_respuestas.push(mis_respuestas_detalladas);
    if (todas_las_respuestas_de_la_frase_son_correctas) {
        activar_estrella(frase_actual, 'exito');
        puntaje_actual = parseInt(puntaje_actual) + parseInt(puntaje);
        $('#cont_puntos').html(parseInt(puntaje_actual));
    } else {
        activar_estrella(frase_actual, 'fallo');
    }
    if (frase_actual === numero_de_preguntas) {
        activar_contenedor('cont_resultados');
        parar_cuenta_regresiva();
        armar_resultados();
    } else {
        frase_actual++;
        siguiente_pregunta();
    }
}
function validar_respuestas_pregunta_frase(mis_respuestas_detalladas, pregunta) {
    for (var i = 0; i < pregunta.respuestas.length; i++) {
        if ($('#vd_' + pregunta.id_pregunta).val() === pregunta.respuestas[i].respuesta) {
            pregunta.respuestas[i].seleccionada = 'si';
            mis_respuestas_detalladas.push(pregunta.pregunta + ' ' + $('#vd_' + pregunta.id_pregunta).val());
            if (pregunta.respuestas[i].es_correcta === 'si') {
                return true;
            } else {
                return false;
            }
        }
    }
    var respuesta_nueva = new Object();
    respuesta_nueva['tipo'] = 'texto';
    respuesta_nueva['seleccionada'] = 'si';
    respuesta_nueva['respuesta'] = $('#vd_' + pregunta.id_pregunta).val();
    respuesta_nueva['es_correcta'] = 'no';
    pregunta.respuestas.push(respuesta_nueva);
    mis_respuestas_detalladas.push(pregunta.pregunta + ' ' + $('#vd_' + pregunta.id_pregunta).val());
    return false;
}
function calcular_resultados() {
    var resultados = '';
    var tu_respuesta = '';
    var respuesta_correcta = '';
    var class_respuesta;
    var imagen_respuesta;
    if (preguntas_realizadas.length > 0) {
        for (var i = 0; i < preguntas_realizadas.length; i++) {
            resultados += '<div class="cont_pregunta">';
            resultados += '<p class="numero_pregunta">Question ' + (i + 1) + '</p>';
            var frase_final = ' ' + armar_final_de_frase(i + 1);
            tu_respuesta = armar_mi_respuesta(i) + frase_final;
            respuesta_correcta = armar_respuesta_correcta(i + 1) + frase_final;
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
                resultados += '<p class="subtitulo_respuesta_txt">Justification: <span class="justificacion">' + preguntas_realizadas[i].justificacion + '</span></p>';
            }
            resultados += '<img src="../assets/img/' + imagen_respuesta + '" alt="Imagen"/>';
            resultados += '</div>';
        }
    } else {
        resultados = '<div style="font-size:xx-large;text-align:center;"><span id="cantidad_intentos_restantes">The time is over and there are no more attempts.</span></div>';
    }
    return resultados;
}
function armar_mi_respuesta(posicion) {
    var tu_respuesta = '';
    for (var j = 0; j < mis_respuestas[posicion].length; j++) {
        tu_respuesta += mis_respuestas[posicion][j] + ' ';
    }
    return tu_respuesta;
}
function armar_respuesta_correcta(frase) {
    var respuesta_correcta = '';
    for (var i = 0; i < preguntas_json.preguntas.length; i++) {
        if (parseInt(frase) === parseInt(preguntas_json.preguntas[i].frase)) {
            respuesta_correcta += preguntas_json.preguntas[i].pregunta + ' ';
            for (var j = 0; j < preguntas_json.preguntas[i].respuestas.length; j++) {
                if (preguntas_json.preguntas[i].respuestas[j].es_correcta === 'si') {
                    respuesta_correcta += preguntas_json.preguntas[i].respuestas[j].respuesta + ' ';
                }
            }
        }
    }
    return respuesta_correcta;
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
    mis_respuestas = new Array();
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
        preguntas_json.preguntas[frase_actual - 1].correcta = 'si';
    }
    preguntas_realizadas.push(preguntas_json.preguntas[frase_actual - 1]);
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