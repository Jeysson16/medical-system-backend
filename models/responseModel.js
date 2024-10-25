// responseModel.js
class ResponseModel {
    constructor(isSuccess, lstError, lstItem, resultado, item) {
        this.isSuccess = isSuccess; // Si la operación fue exitosa
        this.lstError = lstError; // Lista de errores
        this.lstItem = lstItem; // Lista de ítems
        this.resultado = resultado; // Resultado de la operación
        this.item = item; // Un solo ítem
    }
}

// Exportar el modelo
module.exports = ResponseModel;
