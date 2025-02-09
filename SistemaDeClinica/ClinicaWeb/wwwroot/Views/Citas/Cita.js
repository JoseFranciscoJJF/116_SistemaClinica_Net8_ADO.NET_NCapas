let tablaData;
let idEditar = 0;
const controlador = "Citas";
const modal = "mdData";
const preguntaEliminar = "Deseja cancelar sua consulta?";
const confirmaEliminar = "Sua consulta foi cancelada.";

document.addEventListener("DOMContentLoaded", function (event) {

    tablaData = $('#tbData').DataTable({
        responsive: true,
        scrollX: true,
        "ajax": {
            "url": `/${controlador}/ListaCitasPendiente`,
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            { title: "Terminar Consulta", "data": "fechaCita", width: "150px" },
            { title: "Hora Da Consulta", "data": "horaCita", width: "150px" },
            {
                title: "Especialidade", "data": "especialidad", render: function (data, type, row) {
                    return data.nombre
                }
            },
            {
                title: "Doutor", "data": "doctor", render: function (data, type, row) {
                    return `${data.nombres} ${data.apellidos}`
                }
            },
            {
                title: "", "data": "idCita", width: "100px", render: function (data, type, row) {
                    return `<button type="button" class="btn btn-sm btn-outline-danger me-1 btn-cancelar">Cancelar</button>`
                }
            }
        ], language: {
            url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/pt-BR.json"
        },
    });
});


$("#tbData tbody").on("click", ".btn-cancelar", function () {
    let filaSeleccionada = $(this).closest('tr');
    let data = tablaData.row(filaSeleccionada).data();

    Swal.fire({
        text: `${preguntaEliminar}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, continuar",
        cancelButtonText: "Não, voltar"
    }).then((result) => {
        if (result.isConfirmed) {

            fetch(`/${controlador}/Cancelar?Id=${data.idCita}`, {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json;charset=utf-8' }
            }).then(response => {
                return response.ok ? response.json() : Promise.reject(response);
            }).then(responseJson => {
                if (responseJson.data == "") {
                    Swal.fire({
                        title: "Feito!",
                        text: confirmaEliminar,
                        icon: "success"
                    });
                    tablaData.ajax.reload();
                } else {
                    Swal.fire({
                        title: "Erro!",
                        text: "Não pode ser cancelada.",
                        icon: "warning"
                    });
                }
            }).catch((error) => {
                Swal.fire({
                    title: "Erro!",
                    text: "Não ser pode cancelada.",
                    icon: "warning"
                });
            })
        }
    });
})


