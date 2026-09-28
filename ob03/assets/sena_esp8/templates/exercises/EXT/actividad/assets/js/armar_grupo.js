//INICIO VARIABLES GENERALES
var descripcion = "Make categories for concepts.";
var control_de_tiempo = "300";
var numero_de_preguntas = 1;
var numero_sub_preguntas = 3;
var numero_de_intentos = 2;
var puntaje = "1";
var puntaje_actual = "0";
var exito_puntaje = "1";
var preguntas_txt = '{"preguntas":[{"id_pregunta":"1","tipo":"audio","pregunta":"assets/multimedia/enpe8n7le02ob03re4ac03aud01.mp3","respuestas":[{"id_respuesta":"1","tipo":"texto","respuesta":"Cost Savings","es_correcta":"si","seleccionada":"no","bien_ubicada":"no","posicion":"0"},{"id_respuesta":"2","tipo":"texto","respuesta":"Mobile Workforce","es_correcta":"si","seleccionada":"no","bien_ubicada":"no","posicion":"0"},{"id_respuesta":"3","tipo":"texto","respuesta":"Economies of Scale","es_correcta":"si","seleccionada":"no","bien_ubicada":"no","posicion":"0"}],"justificacion":"","pista":"","correcta":"no","frase":"1","posicion":"0"},{"id_pregunta":"2","tipo":"audio","pregunta":"assets/multimedia/enpe8n7le02ob03re4ac03aud02.mp3","respuestas":[{"id_respuesta":"4","tipo":"texto","respuesta":"diminish the quality of technical services.","es_correcta":"si","seleccionada":"no","bien_ubicada":"no","posicion":"0"},{"id_respuesta":"5","tipo":"texto","respuesta":"work without a disaster recovery system.","es_correcta":"si","seleccionada":"no","bien_ubicada":"no","posicion":"0"},{"id_respuesta":"6","tipo":"texto","respuesta":"grow real estate cost services.","es_correcta":"si","seleccionada":"no","bien_ubicada":"no","posicion":"0"}],"justificacion":"","pista":"","correcta":"no","frase":"1"},{"id_pregunta":"3","tipo":"audio","pregunta":"assets/multimedia/enpe8n7le02ob03re4ac03aud03.mp3","respuestas":[{"id_respuesta":"7","tipo":"texto","respuesta":"show responsiveness.","es_correcta":"si","seleccionada":"no","bien_ubicada":"no","posicion":"0"},{"id_respuesta":"8","tipo":"texto","respuesta":"demonstrate expertise in quality.","es_correcta":"si","seleccionada":"no","bien_ubicada":"no","posicion":"0"},{"id_respuesta":"9","tipo":"texto","respuesta":"keep technology and personnel information.","es_correcta":"si","seleccionada":"no","bien_ubicada":"no","posicion":"0"}],"justificacion":"","pista":"","correcta":"no","frase":"1"}]}';
//FIN VARIABLES GENERALES

//VARIABLES DE LA ACTIVIDAD
var preguntas_json = eval("(" + preguntas_txt + ")");
var json_respuesta = [];
var intento_actual = 1;
var frase_actual;
var respuestas_encontradas;
var mis_respuestas;
var numero_respuestas_minimas = (numero_sub_preguntas * 3);
//FIN VARIABLES GENERALES

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
    reinicializar_preguntas_json();
    $('#btn_actividad_container').html('');
    $('#btn_acciones').css('display', 'block');
    $('#cont_puntos').html("0");
    $('#contenedor_draggables').html('');
    $('#contenedor_droppables').html('');
    frase_actual = 0;
    respuestas_encontradas = 0;
    mis_respuestas = new Array();
    inicializa_iconos_preguntas();
    respuestas();
    siguiente_pregunta();
    activar_contenedor('cont_actividad');
    activar_cronometro();
}

/*INICIO FUNCIONES PUNTUALES ACTIVIDAD*/
function respuestas() {
    for (var i = 0; i < preguntas_json.preguntas.length; i++) {
        for (var j = 0; j < preguntas_json.preguntas[i].respuestas.length; j++) {
            var obj = preguntas_json.preguntas[i].respuestas[j]
            json_respuesta.push(obj);
        }
    }
    json_respuesta.mezclar_respuestas();
    armar_respuestas();
}
function siguiente_pregunta() {
    armar_la_frase(frase_actual);
    $('#btn_responder_pregunta').css('display', 'none');
    ocultar_mensaje_de_informacion();
}
function armar_la_frase(frase) {
    armar_preguntas(frase);
    for (var i = 1; i <= numero_respuestas_minimas; i++) {
        $("#droppable_" + i).droppable({
            hoverClass: "ui-state-active",
            drop: function (event, ui) {
                var id = ui.draggable.attr("id");
                asignar_valores(id, $(this).attr("id"));
                $(this).append(ui.draggable.css('position', 'static'));
                $(this).append(ui.draggable.css('width', '100%'));
                $(this).droppable("destroy");
                ui.draggable.draggable("destroy");
            }
        });
    }
    for (var i = 0; i < preguntas_json.preguntas.length; i++) {
        for (var j = 0; j < preguntas_json.preguntas[i].respuestas.length; j++) {
            $("#draggable_" + preguntas_json.preguntas[i].respuestas[j].id_respuesta).css('cursor', 'crosshair');
            $("#draggable_" + preguntas_json.preguntas[i].respuestas[j].id_respuesta).draggable({
                revert: "invalid"
            });
        }
    }
}
function asignar_valores(respuesta, pregunta) {
    var id_respuesta = $('#h_' + respuesta).val();
    var id_pregunta = $('#h_' + pregunta).val();
    var partes = pregunta.split('droppable_');
    var id_posicion = partes[1];

    if (!actualizar_estado_respuesta_en_pregunta(id_pregunta, id_respuesta, id_posicion)) {
        alert('The answer does not exist within the parameterized questions. System error.');
    }
}
function armar_preguntas(frase) {
    var preguntas = '';
    for (var i = 0, j = 1; i < preguntas_json.preguntas.length; i++, j += 3) {
        if (parseInt(frase + 1) === parseInt(preguntas_json.preguntas[i].frase)) {
            var resultado = generar_pregunta_de_acuerdo_a_su_tipo(preguntas_json.preguntas[i]);
            var partes = resultado.split('*****');
            preguntas += '<div class="fila_categorias">';
            preguntas += '<div class="categoria col_categoria_1" id="droppable_' + j + '"><input type="hidden" value="' + preguntas_json.preguntas[i].id_pregunta + '" id="h_droppable_' + j + '"/></div>';
            preguntas += '<div class="categoria col_categoria_2" id="droppable_' + (j + 1) + '"><input type="hidden" value="' + preguntas_json.preguntas[i].id_pregunta + '" id="h_droppable_' + (j + 1) + '"/></div>';
            preguntas += '<div class="categoria col_categoria_3" id="droppable_' + (j + 2) + '"><input type="hidden" value="' + preguntas_json.preguntas[i].id_pregunta + '" id="h_droppable_' + (j + 2) + '"/></div>';
            preguntas += '<div class="categoria icono_texto">';
            preguntas += '<img onclick="mostrar_popup_resultado(\'Question ' + (i + 1) + '\', \'' + partes[0] + '\');" src="assets/img/' + partes[1] + '" alt="Imagen"/>';
            preguntas += '</div>';
            preguntas += '</div>';
        }
    }
    $('#contenedor_droppables').html(preguntas);
}
function armar_respuestas() {
    var respuestas = '';
    var col_elemento;
    $('#contenedor_draggables').html('');
    for (var i = 1; i <= json_respuesta.length; i++) {
        col_elemento = 'col_elemento_1';
        if (i % 2 === 0) {
            col_elemento = 'col_elemento_2';
        }
        var respuesta_a_mostrar = json_respuesta[(i - 1)]['respuesta'];
        if (json_respuesta[(i - 1)]['tipo'] === 'imagen') {
            respuesta_a_mostrar = '<img class="img_droppable" src="' + json_respuesta[(i - 1)]['respuesta'] + '" alt="Imagen"/>';
        }
        respuestas += '<div class="contenedor_elemento">';
        respuestas += '<div id="draggable_' + json_respuesta[(i - 1)]['id_respuesta'] + '" class="elemento">';
        respuestas += '<div class="' + col_elemento + '">' + respuesta_a_mostrar;
        respuestas += '<input type="hidden" value="' + json_respuesta[(i - 1)].id_respuesta + '" id="h_draggable_' + json_respuesta[(i - 1)]['id_respuesta'] + '"/></div>';
        respuestas += '</div>';
        respuestas += '</div>';
    }
    $('#contenedor_draggables').html(respuestas);
}
function responder_pregunta() {
    var todas_las_respuestas_de_la_frase_son_correctas = true;
    for (var i = 0; i < preguntas_json.preguntas.length; i++) {
        if (parseInt((frase_actual + 1)) === parseInt(preguntas_json.preguntas[i].frase)) {
            var respuestas_correctas = buscar_respuesta_correctas_por_pregunta(i);
            if (respuestas_correctas !== 3) {
                todas_las_respuestas_de_la_frase_son_correctas = false;
            }
        }
    }
    if (todas_las_respuestas_de_la_frase_son_correctas) {
        activar_estrella((frase_actual + 1), 'exito');
        puntaje_actual = parseInt(puntaje_actual) + parseInt(puntaje);
        $('#cont_puntos').html(parseInt(puntaje_actual));
    } else {
        activar_estrella((frase_actual + 1), 'fallo');
    }
    if ((frase_actual + 1) === numero_de_preguntas) {
        activar_contenedor('cont_resultados');
        parar_cuenta_regresiva();
        armar_resultados();
    } else {
        frase_actual++;
        siguiente_pregunta();
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
    resultados += '<div class="resultado_fallo_armar_grupo">';
    if (preguntas_json.preguntas.length > 0) {
        resultados += '<div class="armar_grupo_respuesta_correcta">';
        resultados += '<span>Correct answer</span>';
        resultados += '<div class="respuestas">';
        for (var i = 0; i < preguntas_json.preguntas.length; i++) {
            resultados += '<div class="row_resultado_fallo_armar_grupo">';
            for (var j = 0; j < preguntas_json.preguntas[i].respuestas.length; j++) {
                if (preguntas_json.preguntas[i].respuestas[j].es_correcta === 'si') {
                    var respuesta_transformada = generar_respuesta_de_acuerdo_a_su_tipo(preguntas_json.preguntas[i].respuestas[j]);
                    resultados += '<div class="resultado_col">' + respuesta_transformada + '</div>';
                }
            }
            resultados += '<div class="icono_texto_resultado_fallo_armar_grupo">';
            var resultado_p = generar_pregunta_de_acuerdo_a_su_tipo(preguntas_json.preguntas[i]);
            var partes = resultado_p.split('*****');
            resultados += '<img onclick="mostrar_popup(\'Question ' + (i + 1) + '\', \'' + partes[0] + '\');" src="assets/img/' + partes[1] + '" alt="Imagen"/>';
            resultados += '</div>';
            resultados += '</div>';

        }
        resultados += '</div>';
        resultados += '</div>';
        resultados += '<div class="armar_grupo_respuesta_incorrecta">';
        resultados += '<span>Your answer</span>';
        resultados += '<div class="respuestas">';
        for (var i = 0; i < preguntas_json.preguntas.length; i++) {
            resultados += '<div class="row_resultado_fallo_armar_grupo">';
            for (var j = 0; j < mis_respuestas.length; j++) {
                if (preguntas_json.preguntas[i].id_pregunta === mis_respuestas[j].id_pregunta) {
                    if (mis_respuestas[j].id_respuesta > 0) {
                        respuesta_transformada = generar_respuesta_de_acuerdo_a_su_tipo(mis_respuestas[j]);
                        resultados += '<div class="resultado_col_' + (j + 1) + '" style="border: solid 2px #01b1be;">' + respuesta_transformada + '</div>';
                    } else {
                        respuesta_transformada = '<div class="elemento_respuesta"><div class="col_elemento_respuesta">Empty answer</div></div>';
                        resultados += '<div class="resultado_col_' + (j + 1) + '" style="border: solid 2px #01b1be;">' + respuesta_transformada + '</div>';
                    }
                }
            }
            resultados += '<div class="icono_texto_resultado_fallo_armar_grupo">';
            var resultado_r = generar_pregunta_de_acuerdo_a_su_tipo(preguntas_json.preguntas[i]);
            var partes_r = resultado_r.split('*****');
            resultados += '<img onclick="mostrar_popup(\'Question ' + (i + 1) + '\', \'' + partes_r[0] + '\');" src="assets/img/' + partes_r[1] + '" alt="Imagen"/>';
            resultados += '</div>';
            resultados += '</div>';
        }
        resultados += '</div>';
        resultados += '</div>';
    }
    resultados += '</div>';

    return resultados;
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
    $('#cont_puntos').html("0");
    $('#btn_actividad_container').html('');
    puntaje_actual = "0";
    intento_actual++;
    json_respuesta = [];
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
        preguntas_json.preguntas[(num_pregunta - 1)].correcta = 'si';
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

function mostrar_popup_resultado(titulo, mensaje) {
    $('#titulo').html(titulo);
    $('#mensaje').html(mensaje);
    $('#modal_armar_grupo').css('display','block');
    $('#popup_overlay').fadeIn('fast');
    return false;
}
function ocultar_popup_resultado() {
    mostrar_popup_resultado('', '');
    $('#modal_armar_grupo').css('display','none');
    $('#popup_overlay').fadeOut('fast');
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
function actualizar_estado_respuesta_en_pregunta(id_pregunta, id_respuesta, id_posicion) {
    var respuesta_actualizada = false;
    var respuesta = '';
    var tipo = '';
    for (var i = 0; i < preguntas_json.preguntas.length; i++) {
        for (var j = 0; j < preguntas_json.preguntas[i].respuestas.length; j++) {
            if (parseInt(id_respuesta) === parseInt(preguntas_json.preguntas[i].respuestas[j].id_respuesta)) {
                if (id_pregunta === preguntas_json.preguntas[i].id_pregunta) {
                    preguntas_json.preguntas[i].respuestas[j].bien_ubicada = 'si';
                } else {
                    preguntas_json.preguntas[i].respuestas[j].bien_ubicada = 'no';
                }
                if (preguntas_json.preguntas[i].respuestas[j].seleccionada !== 'si') {
                    respuestas_encontradas++;
                }
                preguntas_json.preguntas[i].respuestas[j].seleccionada = 'si';
                preguntas_json.preguntas[i].respuestas[j].posicion = id_posicion;
                respuesta = preguntas_json.preguntas[i].respuestas[j].respuesta;
                tipo = preguntas_json.preguntas[i].respuestas[j].tipo;
                respuesta_actualizada = true;
            }
        }
    }
    var obj = {
        'id_respuesta': id_respuesta,
        'id_pregunta': id_pregunta,
        'id_posicion': id_posicion,
        'respuesta': respuesta,
        'tipo': tipo
    }
    mis_respuestas.push(obj);
    mis_respuestas.sort(compareNumbers);
    if (mis_respuestas.length === numero_respuestas_minimas) {
        $('#btn_actividad_container').html('<button id="btn_acciones" onclick="responder_pregunta();" class="btn_actividad btn_enviar_morado">Submit</button>');
    }
    return respuesta_actualizada;
}
function compareNumbers(a, b) {
    return a.id_posicion - b.id_posicion;
}
function reinicializar_preguntas_json() {
    for (var i = 0; i < preguntas_json.preguntas.length; i++) {
        for (var j = 0; j < preguntas_json.preguntas[i].respuestas.length; j++) {
            preguntas_json.preguntas[i].respuestas[j].bien_ubicada = 'no';
            preguntas_json.preguntas[i].respuestas[j].seleccionada = 'no';
        }
    }
}
function buscar_respuesta_correctas_por_pregunta(posicion) {
    var respuestas_encontradas = 0;
    for (var i = 0; i < preguntas_json.preguntas[posicion].respuestas.length; i++) {
        if (preguntas_json.preguntas[posicion].respuestas[i].es_correcta === 'si' && preguntas_json.preguntas[posicion].respuestas[i].seleccionada === 'si' && preguntas_json.preguntas[posicion].respuestas[i].bien_ubicada === 'si') {
            respuestas_encontradas++;
        }
    }
    if (respuestas_encontradas === 3) {
        preguntas_json.preguntas[posicion].correcta = 'si';
    }
    return respuestas_encontradas;
}
function generar_pregunta_de_acuerdo_a_su_tipo(pregunta) {
    var respuesta = '';
    var img_tipo;
    switch (pregunta.tipo) {
        case 'texto':
            respuesta = pregunta.pregunta;
            img_tipo = 'icono_texto.png';
            break;
        case 'audio':
            respuesta = '<audio controls>';
            respuesta += "<source src=\\'" + pregunta.pregunta + "\\' type=\\'audio/ogg\\'>";
            respuesta += "<source src=\\'" + pregunta.pregunta + "\\' type=\\'audio/mpeg\\'>";
            respuesta += "NO SOPORTA AUDIOS";
            respuesta += "</audio>";
            img_tipo = 'icono_audio.png';
            break;
        case 'imagen':
            respuesta = "<img class=\\'img_droppable\\' src=\\'" + pregunta.pregunta + "\\' alt=\\'Imagen\\'/>";
            img_tipo = 'icono_imagen.png';
            break;
        case 'video':
            respuesta = '<video controls>';
            respuesta += "<source src=\\'" + pregunta.pregunta + "\\' type=\\'video/ogg\\'>";
            respuesta += "<source src=\\'" + pregunta.pregunta + "\\' type=\\'video/mp4\\'>";
            respuesta += "NO SOPORTA VIDEOS";
            respuesta += "</video>";
            img_tipo = 'icono_video.png';
            break;
        default:
            respuesta = 'NO EXISTE EL TIPO DE CONTENIDO ' + pregunta.tipo + ' PARA LA PREGUNTA: ' + pregunta.pregunta;
            img_tipo = 'icono_texto.png';
    }
    return respuesta + '*****' + img_tipo;
}
/*
 * <div class="elemento">
 *      <div class="col_elemento_1">la cuatro1</div>
 * </div>
 */
function generar_respuesta_de_acuerdo_a_su_tipo(respuesta) {
    switch (respuesta.tipo) {
        case 'texto':
            respuesta = respuesta.respuesta;
            break;
        case 'audio':
            respuesta = '<audio controls>';
            respuesta += "<source src=\\'" + respuesta.respuesta + "\\' type=\\'audio/ogg\\'>";
            respuesta += "<source src=\\'" + respuesta.respuesta + "\\' type=\\'audio/mpeg\\'>";
            respuesta += "NO SOPORTA AUDIOS";
            respuesta += "</audio>";
            break;
        case 'imagen':
            respuesta = "<img class='img_respuesta' src='" + respuesta.respuesta + "' alt='Imagen'/>";
            break;
        case 'video':
            respuesta = '<video controls>';
            respuesta += "<source src=\\'" + respuesta.respuesta + "\\' type=\\'video/ogg\\'>";
            respuesta += "<source src=\\'" + respuesta.respuesta + "\\' type=\\'video/mp4\\'>";
            respuesta += "NO SOPORTA VIDEOS";
            respuesta += "</video>";
            break;
        default:
            respuesta = 'NO EXISTE EL TIPO DE CONTENIDO ' + respuesta.tipo + ' PARA LA RESPUESTA: ' + respuesta.respuesta;
            break;
    }
    return '<div class="elemento_respuesta"><div class="col_elemento_respuesta">' + respuesta + '</div></div>';
}
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