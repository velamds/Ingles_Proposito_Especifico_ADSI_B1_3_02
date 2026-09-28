//INICIO VARIABLES GENERALES
var descripcion = "Test your knowledge by matching the cards according to the information presented.";
var control_de_tiempo = "300";
var numero_de_intentos = 2;
var puntaje = "1";
var puntaje_actual = "0";
var preguntas_realizadas = new Array();
var respuestas_realizadas = new Array();
var resp_realizadas_ordenada = new Array();
var preguntas_txt = '{"preguntas":[{"id_pregunta":"1","tipo":"texto","pregunta":"The provisions of the SaaS contract must be analyzed in detail.","respuestas":[{"tipo":"texto","Respuesta_7":"7","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"},{"id_pregunta":"2","tipo":"texto","pregunta":"Before the negotiations, the SLA contract must be given.","respuestas":[{"tipo":"texto","respuesta":"8","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"},{"id_pregunta":"3","tipo":"texto","pregunta":"If the customer wants an efficient cloud service, he needs to go over the SLA because some provisions,","respuestas":[{"tipo":"texto","respuesta":"9","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"},{"id_pregunta":"4","tipo":"texto","pregunta":"Cure periods in case of breach should be measured in days.","respuestas":[{"tipo":"texto","respuesta":"10","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"},{"id_pregunta":"5","tipo":"texto","pregunta":"A security plan to protect customers’ data must be specified in","respuestas":[{"tipo":"texto","respuesta":"11","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"},{"id_pregunta":"6","tipo":"texto","pregunta":"And some provisions, such as availability of data,","respuestas":[{"tipo":"texto","respuesta":"12","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"},{"id_pregunta":"7","tipo":"texto","pregunta":"detail and taken into account. ","respuestas":[{"tipo":"texto","respuesta":"1","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"},{"id_pregunta":"8","tipo":"texto","pregunta":"be given to the customer.","respuestas":[{"tipo":"texto","respuesta":"2","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"},{"id_pregunta":"9","tipo":"texto","pregunta":"some provisions, such as availability of data must be included.","respuestas":[{"tipo":"texto","respuesta":"3","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"},{"id_pregunta":"10","tipo":"texto","pregunta":"in days. That way, the customer does not rush to get a new provider.","respuestas":[{"tipo":"texto","respuesta":"4","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"},{"id_pregunta":"11","tipo":"texto","pregunta":"data must be specified in the SaaS contract.","respuestas":[{"tipo":"texto","respuesta":"5","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"},{"id_pregunta":"12","tipo":"texto","pregunta":"must be included on the SLA.","respuestas":[{"tipo":"texto","respuesta":"6","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"}]}';
var matriz = "3x4";
var respuesta = [];
var intento_actual = 1;
var sum_pregunta = 1;
//VARIABLES DE LA ACTIVIDAD
var preguntas_json = eval("(" + preguntas_txt + ")");
var pregunta_actual;
var numero_de_preguntas = preguntas_json.preguntas.length;
var exito_puntaje = (parseInt(numero_de_preguntas) * parseInt(puntaje) / 2);
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
    $('#btn_actividad_container').css('display', 'none');
    $('#cont_puntos').html("0");
    pregunta_actual = 0;
    preguntas_json.preguntas.mezclar_preguntas();
    crear_tablero();
    activar_contenedor('cont_actividad');
    activar_cronometro();
}

function crear_tablero() {
    $('#contenedor_preguntas').html('');
    var partes = matriz.split('x');
    var response = '';
    for (var i = 1; i <= partes[0]; i++) {
        response += '<div class="est_parj_fila_' + i + '">';
        for (var j = 1; j <= partes[1]; j++) {
            var resultado = generar_pregunta_de_acuerdo_a_su_tipo(preguntas_json.preguntas[pregunta_actual], 1);
            var partes_result = resultado.split('*****');
            response += '<div class="est_parj_imagen_' + j + '" id="est_parj_imagen_' + pregunta_actual + '">';
            response += '<img onclick="mostrar_popup_resultado(\'Question ' + (pregunta_actual + 1) + '\', \'' + partes_result[0] + '\');" src="assets/img/' + partes_result[1] + '" alt="Imagen"/>';
            response += '<img onClick="seleccionar_pregunta(' + (pregunta_actual) + ')" class="est_parj_selector" id="est_parj_selector_gris' + (pregunta_actual) + '" src="assets/img/check_gris.png" alt="Imagen" style="display:"";"/>';
            response += '<img class="est_parj_selector" id="est_parj_selector_verde' + (pregunta_actual) + '" src="assets/img/check_verde.png" alt="Imagen" style="display:none;"/><span id="est_parj_num' + (pregunta_actual) + '" class="est_parj_num"></span>';
            response += '</div>';
            var resultado = generar_pregunta_de_acuerdo_a_su_tipo(preguntas_json.preguntas[pregunta_actual], 2);
            var partes_result = resultado.split('*****');
            response += '<div class="est_select_imagen_' + j + '" id="est_select_imagen_' + pregunta_actual + '" style="display: none;">';
            response += '<img onclick="mostrar_popup_resultado(\'Question ' + (pregunta_actual + 1) + '\', \'' + partes_result[0] + '\');" src="assets/img/' + partes_result[1] + '" alt="Imagen"/>';
            response += '<img onClick="seleccionar_pregunta(' + (pregunta_actual) + ')" class="est_parj_selector" id="est_parj_select_gris' + (pregunta_actual) + '" src="assets/img/check_gris.png" alt="Imagen" style="display:"";"/>';
            response += '<img class="est_parj_selector" id="est_parj_select_verde' + (pregunta_actual) + '" src="assets/img/check_verde.png" alt="Imagen" style="display:none;"/><span id="est_select_num' + (pregunta_actual) + '" class="est_parj_num"></span>';
            response += '</div>';
            pregunta_actual++;
        }
        response += '</div>';
    }
    $('#contenedor_preguntas').html(response);
}

function seleccionar_pregunta(count) {
    var contador = 0;

    $("#est_parj_imagen_" + count).hide();
    $("#est_select_imagen_" + count).show();
    $("#est_parj_select_gris" + count).hide();
    $("#est_parj_select_verde" + count).show();
    preguntas_json.preguntas[count].respuestas[0].seleccionada = 'si';

    var obj = {
        'id': count,
        'id_pregunta': preguntas_json.preguntas[count].id_pregunta,
        'pregunta': preguntas_json.preguntas[count].pregunta,
        'respuesta': preguntas_json.preguntas[count].respuestas[0].respuesta,
        'tipo': preguntas_json.preguntas[count].tipo,
        'control': 4
    }
    respuesta.push(obj);
    respuestas_realizadas.push(obj);
    $('#est_select_num' + count).html(sum_pregunta);
    if (respuesta.length === 2) {
        if ((respuesta[0].id_pregunta === respuesta[1].respuesta) && (respuesta[0].respuesta === respuesta[1].id_pregunta)) {
            puntaje_actual = parseInt(puntaje_actual) + parseInt(puntaje);
            $('#cont_puntos').html(parseInt(puntaje_actual));
            respuesta[0].control = 3;
            respuesta[1].control = 3;
        }
        for (var i = 0; i < preguntas_json.preguntas.length; i++) {
            if (preguntas_json.preguntas[i].respuestas[0].seleccionada == 'si') {
                contador++;
            }
        }
        sum_pregunta++;
        respuesta = [];
        if (preguntas_json.preguntas.length === contador) {
            activar_contenedor('cont_resultados');
            parar_cuenta_regresiva();
            armar_resultados();
        }
    }
}

function armar_resultados() {
    ocultar_popup_resultado();
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
    if (preguntas_json.preguntas.length > 0) {
        resultados += '<div class="establecer_parejas_resultado_fallo">';
        resultados += '<div>';
        resultados += 'Correct answer';
        for (var i = 0; i < respuestas_realizadas.length; i++) {
            var control = 0;
            if (preguntas_realizadas.length > 0) {
                for (var j = 0; j < preguntas_realizadas.length; j++) {
                    if (respuestas_realizadas[i].id_pregunta === preguntas_realizadas[j].id_pregunta) {
                        control = 1;
                    }
                }
            }
            if (control === 0) {
                var obj = {
                    'id_pregunta': respuestas_realizadas[i].id_pregunta,
                    'pregunta': respuestas_realizadas[i].pregunta,
                    'respuesta': respuestas_realizadas[i].respuesta,
                    'tipo': respuestas_realizadas[i].tipo,
                    'control': 4,
                    'control_respuesta': respuestas_realizadas[i].control

                }
                preguntas_realizadas.push(obj);
                for (var k = 0; k < respuestas_realizadas.length; k++) {
                    if (respuestas_realizadas[i].respuesta === respuestas_realizadas[k].id_pregunta) {
                        var obj = {
                            'id_pregunta': respuestas_realizadas[k].id_pregunta,
                            'pregunta': respuestas_realizadas[k].pregunta,
                            'respuesta': respuestas_realizadas[k].respuesta,
                            'tipo': respuestas_realizadas[k].tipo,
                            'control': 4,
                            'control_respuesta': respuestas_realizadas[i].control
                        }
                        preguntas_realizadas.push(obj);
                    }
                }
            }
        }

        for (var j = 0; j < preguntas_realizadas.length; j++) {
            var resultado = generar_pregunta_de_acuerdo_a_su_tipo(preguntas_realizadas[j], 3);
            var partes_result = resultado.split('*****');
            if (j % 2 == 0) {
                resultados += '<div>';
            }
            resultados += '<div><img onclick="mostrar_popup(\'Question ' + (j + 1) + '\', \'' + partes_result[0] + '\');" src="assets/img/' + partes_result[1] + '" alt="Imagen"/></div>';
            if (j % 2 != 0) {
                resultados += '</div>';
            }
        }
        resultados += '</div>';
        resultados += '<div class="col-xs-offset-2">';
        resultados += 'Your answer';
        for (var k = 0; k < respuestas_realizadas.length; k++) {
            var resultado_1 = generar_pregunta_de_acuerdo_a_su_tipo(respuestas_realizadas[k], respuestas_realizadas[k].control);
            var partes_result_1 = resultado_1.split('*****');
            if (k % 2 == 0) {
                resultados += '<div>';
            }
            resultados += '<div><img onclick="mostrar_popup(\'Question ' + (k + 1) + '\', \'' + partes_result_1[0] + '\');" src="assets/img/' + partes_result_1[1] + '" alt="Imagen"/></div>';
            if (k % 2 != 0) {
                resultados += '</div>';
            }
        }
        resultados += '</div>';
        resultados += '</div>';
    }

    return resultados;
}

function generar_pregunta_de_acuerdo_a_su_tipo(pregunta, control) {
    var respuesta = '';
    var img_tipo;
    switch (pregunta.tipo) {
        case 'texto':
            respuesta = pregunta.pregunta;
            if (control === 1) {
                img_tipo = 'parejas_texto2.png';
            } else if (control === 2) {
                img_tipo = 'parejas_texto.png';
            } else if (control === 3) {
                img_tipo = 'parejas_texto4.png';
            } else {
                img_tipo = 'parejas_texto5.png';
            }
            break;
        case 'audio':
            respuesta = '<audio controls>';
            respuesta += "<source src=\\'" + pregunta.pregunta + "\\' type=\\'audio/ogg\\'>";
            respuesta += "<source src=\\'" + pregunta.pregunta + "\\' type=\\'audio/mpeg\\'>";
            respuesta += "NO SOPORTA AUDIOS";
            respuesta += "</audio>";
            if (control === 1) {
                img_tipo = 'parejas_audio2.png';
            } else if (control === 2) {
                img_tipo = 'parejas_audio.png';
            } else if (control === 3) {
                img_tipo = 'parejas_audio4.png';
            } else {
                img_tipo = 'parejas_audio5.png';
            }
            break;
        case 'imagen':
            respuesta = "<img class=\\'img_droppable\\' src=\\'" + pregunta.pregunta + "\\' alt=\\'Imagen\\'/>";
            img_tipo = 'parejas_imagen.png';
            break;
        case 'video':
            respuesta = '<video controls>';
            respuesta += "<source src=\\'" + pregunta.pregunta + "\\' type=\\'video/ogg\\'>";
            respuesta += "<source src=\\'" + pregunta.pregunta + "\\' type=\\'video/mp4\\'>";
            respuesta += "NO SOPORTA VIDEOS";
            respuesta += "</video>";
            if (control === 1) {
                img_tipo = 'parejas_video2.png';
            } else if (control === 2) {
                img_tipo = 'parejas_video.png';
            } else if (control === 3) {
                img_tipo = 'parejas_video4.png';
            } else {
                img_tipo = 'parejas_video5.png';
            }
            break;
        default:
            respuesta = 'NO EXISTE EL TIPO DE CONTENIDO ' + pregunta.tipo + ' PARA LA PREGUNTA: ' + pregunta.pregunta;
            if (control === 1) {
                img_tipo = 'parejas_texto2.png';
            } else if (control === 2) {
                img_tipo = 'parejas_texto.png';
            } else if (control === 3) {
                img_tipo = 'parejas_texto4.png';
            } else {
                img_tipo = 'parejas_texto5.png';
            }
            break;
    }
    return respuesta + '*****' + img_tipo;
}

function limpiar_json() {
    for (var i = 0; i < preguntas_json.preguntas.length; i++) {
        preguntas_json.preguntas[i].respuestas[0].seleccionada = 'no';
    }
}

function reintentar() {
    respuestas_realizadas = new Array();
    preguntas_realizadas = new Array();
    limpiar_json();
    $('#cont_puntos').html("0");
    puntaje_actual = "0";
    sum_pregunta = 1;
    intento_actual++;
    inicializar_actividad();
}

function perdio_por_tiempo() {
    activar_contenedor('cont_resultados');
    armar_resultados();
}

function mostrar_popup_resultado(titulo, mensaje) {
    $('#titulo').html(titulo);
    $('#mensaje').html(mensaje);
    $('#modal_establecer_parejas').css('display', 'block');
    $('#popup_overlay').fadeIn('slow');
    return false;
}

function ocultar_popup_resultado() {
    mostrar_popup_resultado('', '');
    $('#modal_establecer_parejas').css('display', 'none');
    $('#popup_overlay').fadeOut('slow');
    return false;
}

function mostrar_popup(titulo, mensaje) {
    $('#titulo_resp').html(titulo);
    $('#mensaje_resp').html(mensaje);
    $('#modal_popup').css('display', 'block');
    $('#popup_overlay').fadeIn('slow');
    return false;
}

function ocultar_popup() {
    mostrar_popup('', '');
    $('#modal_popup').css('display', 'none');
    $('#popup_overlay').fadeOut('slow');
    return false;
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
}
;
$(window).load(setTimeout(inicializar_reglas_actividad(), 1000));