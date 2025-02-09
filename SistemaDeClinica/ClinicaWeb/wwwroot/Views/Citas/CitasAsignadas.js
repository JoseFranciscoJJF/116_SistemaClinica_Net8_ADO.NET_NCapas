let tablaData;
let idCitaSeleccionada = 0;
const controlador = "Doctor";
const modal = "mdData";

document.addEventListener("DOMContentLoaded", function (event) {

    tablaData = $('#tbData').DataTable({
        processing:true,
        responsive: true,
        scrollX: true,
        "ajax": {
            "url": `/${controlador}/ListaCitasAsignadas?IdEstadoCita=1`,
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            { title: "Terminar Consulta", "data": "fechaCita", width: "150px" },
            { title: "Hora Da Consulta", "data": "horaCita", width: "150px" },
            {
                title: "Paciente", "data": "usuario", render: function (data, type, row) {
                    return `${data.nombre} ${data.apellido}`
                }
            },
            {
                title: "Estado", "data": "estadoCita", render: function (data, type, row) {
                    return data.nombre == "Pendiente" ? `<span class="badge bg-primary">Pendente</span>` :
                        `<span class="badge bg-success">Atendida</span>`
                }/*
                title: "Estado", "data": "estadoCita", render: function (data, type, row) {
                    return data.nombre == "Pendiente" ? `<span class="badge bg-primary">${data.nombre}</span>` :
                        `<span class="badge bg-success">${data.nombre}</span>`
                }*/
            },
            {
                title: "", "data": "idCita", width: "100px", render: function (data, type, row) {
                    return `<button type="button" class="btn btn-sm btn-outline-warning me-1 btn-indicaciones">Indicações</button>`
                }
            }
        ], language: {
            url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/pt-BR.json"
        },
    });
});


$("#cboEstadoCita").on("change", function () {
    var nueva_url = `/${controlador}/ListaCitasAsignadas?IdEstadoCita=${$("#cboEstadoCita").val()}`
    tablaData.ajax.url(nueva_url).load();
})

$("#tbData tbody").on("click", ".btn-indicaciones", function () {
    const filaSeleccionada = $(this).closest('tr');
    const data = tablaData.row(filaSeleccionada).data();
    console.log(data)
    idCitaSeleccionada = data.idCita;
    $("#txtIndicaciones").val(data.indicaciones)
    $(`#${modal}`).modal('show');
    $("#txtIndicaciones").trigger("focus");

    if (data.estadoCita.nombre == "Atendida") {
        $("#txtIndicaciones").prop('disabled', true);
        $("#btnTerminarCita").prop('disabled', true);
        $('.alert-primary').hide();
    } else {
        $("#txtIndicaciones").prop('disabled', false);
        $("#btnTerminarCita").prop('disabled', false);
        $('.alert-primary').show();
    }
})

$("#btnTerminarCita").on("click", function () {
    if ($("#txtIndicaciones").val().trim() == ""
    ) {
        Swal.fire({
            title: "Importante!",
            text: "Deve inserir as indicações.",
            icon: "warning"
        });
        return
    }

    const objeto = {
        IdCita: idCitaSeleccionada,
        EstadoCita: {
            IdEstadoCita: 2
        },
        Indicaciones: $("#txtIndicaciones").val().trim(),
    }

    fetch(`/${controlador}/CambiarEstado`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(objeto)
    }).then(response => {
        return response.ok ? response.json() : Promise.reject(response);
    }).then(responseJson => {
        if (responseJson.data == "") {
            Swal.fire({
                title: "Feito!",
                text: "A consulta está marcada como ATENDIDA.",
                icon: "success"
            });
            $(`#${modal}`).modal('hide');
            tablaData.ajax.reload();
        } else {
            Swal.fire({
                title: "Erro!",
                text: responseJson.data,
                icon: "warning"
            });
        }
    }).catch((error) => {
        Swal.fire({
            title: "Erro!",
            text: "Não foi possível fazer o registro.",
            icon: "warning"
        });
    })

})