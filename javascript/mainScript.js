
var parameterGlobal              = "";
var parameterValGlobal           = "";
var currentPage                  = 1;
var searchInput                  = $("#searchInput");
var searchButtonDropdown         = $("#searchButtonDropdown");
var idToEdit                     = 0;
var nameToEdit                   = "";
var changeButtonDropdown         = $("#changeButtonDropdown");
var changeAmountForm             = $("#changeAmountForm");
var changeAmountHelp             = $("#changeAmountHelp");
var amountToOperate              = $("#amountToOperate");
var amountGlobal                 = 0;
var amountMaxGlobal              = 0;
var amountMinGlobal              = 0;
var amountMaxLabel               = $("#amountMaxLabel");
var amountMinLabel               = $("#amountMinLabel");
var currentAmountLabel           = $("#currentAmountLabel");
var submitButton                 = $("#submitButton");
var modalWindowTitle             = $("#modalWindowTitle");
var modalTriggerButton           = $("#modalTriggerButton");
var pagination                   = $("#pagination");
var tableBody                    = $("#tableBody");
var modalWindwo                  = $("#modalWindow");
var cancelButton                 = $("#cancelButton");
var cancelChangingButton         = $("#cancelChangingButton");
var newProductForm               = $("#newProductForm");
var productName                  = $("#productName");
var brand                        = $("#brand");
var seriesNumber                 = $("#seriesNumber");
var amount                       = $("#amount");
var amountMax                    = $("#amountMax");
var amountMin                    = $("#amountMin");
var store                        = $("#store");
var rack                         = $("#rack");
var level                        = $("#level");
var productLocation              = $("#productLocation");

var inputArray = {
      "productName" : productName, 
      "brand" : brand,
      "seriesNumber" : seriesNumber,
      "amount" : amount,
      "amountMax" : amountMax,
      "amountMin" : amountMin,
      "store" : store,
      "rack" : rack,
      "level" : level,
      "productLocation" : productLocation
   };

$(document).ready(function(){
   loadDatabase(1);
   $("td").addClass("align-middle");
   $("th").addClass("align-middle");
   newProductForm.on("submit", function(event){
      event.preventDefault();
      var productNameValidated = validateProductExists(productName.val());
      var productFomrValidated = validateNewProductForm();
      var productAmountValidated = validateProductAmount();
      if(productAmountValidated && productFomrValidated){
         var formData = new FormData(this);
         if(modalWindowTitle.text() === "Editar información de producto"){
            console.log(nameToEdit);
            if(productName.val() === nameToEdit || (productName.val() !== nameToEdit && productNameValidated)){
               formData.append("id", idToEdit);
               $.ajax({
                  type: "POST",
                  url: "php/updateProduct.php",
                  data: formData,
                  contentType: false,
                  cache: false,
                  processData: false,
                  success: function(response){
                     cancelButton.trigger("click");
                     loadDatabase(1);
                  }
               });
            }
         }else if(modalWindowTitle.text() === "Agregar nuevo producto"){
            if(productNameValidated){
               $.ajax({
                  type: "POST",
                  url: "php/addNewProduct.php",
                  data: formData,
                  contentType: false,
                  cache: false,
                  processData: false,
                  success: function(){
                     cancelButton.trigger("click");
                     loadDatabase(1);
                  }
               });
            }
         }
      }else{
         $("#productNameHelp").text("El nombre del producto que desea ingresar ya existe...");
      }
   });
   productName.keyup(function(){
      if($(this).val() != ""){
         if(!validateProductExists($(this).val())){
            $("#productNameHelp").text("El nombre del producto que desea ingresar ya existe...");
         }else{
            $("#productNameHelp").text("");
         }
      }
   });
   changeAmountForm.on("submit", function(event){
      event.preventDefault();
      makeChange();
   });
   modalTriggerButton.on("click", function(event){
      event.preventDefault();
      modalWindowTitle.text("Agregar nuevo producto");
      submitButton.text("Guardar");
      amount.css("display", "block");
      $("#amountLabel").css("display", "block");
   });
   searchInput.keyup(function(){
      var parameterVal;
      var parameter = searchButtonDropdown.text();
      if($(this).val() != ""){
         if(parameter == "Nombre"){
            parameter = "nombre_producto";
            parameterVal = $(this).val();
         }else if(parameter == "Numero de serie"){
            parameter = "numero_de_serie";
            parameterVal = parseInt($(this).val(), 10);
         }
         parameterGlobal = parameter;
         parameterValGlobal = parameterVal;
         loadDatabase(1, parameter, parameterVal);
      }else{
         loadDatabase(1);
      }
   });
   $(document).on("click", ".pageButton", function(event){
      event.preventDefault();
      var id = $(this).attr("id");
      loadDatabase(id);
   });
   $(document).on("click", ".deleteButton", function(event){
      event.preventDefault();
      var x = window.confirm("Esta seguro que desea eliminar este archivo de la base de datos ?");
      if(x){
         var id = $(this).attr("id");
         deleteProduct(id);
      }
   });
   $(document).on("click", ".editButton", function(event){
      event.preventDefault();
      modalWindowTitle.text("Editar información de producto");
      submitButton.text("Guardar cambios");
      amount.css("display", "none");
      $("#amountLabel").css("display", "none");
      var id = $(this).attr("id");
      idToEdit = id;
      getProductData(id);
   });
   $(document).on("click", ".changeButton", function(event){
      event.preventDefault();
      var id = $(this).attr("id");
      getProductLimits(id);
      idToEdit = id;
   });
   $(document).on("click", ".changeOption", function(event){
      event.preventDefault();
      changeButtonDropdown.text($(this).text());
   });
   $(document).on("click", ".searchOption", function(event){
      event.preventDefault();
      var thisText = $(this).text();
      searchButtonDropdown.text(thisText);
      searchInput.attr("placeholder", thisText);
      searchInput.val("");
      if(thisText === "Numero de serie"){
         searchInput.attr("type", "number");
      }else if(thisText === "Nombre"){
         searchInput.attr("type", "text");
      }
      loadDatabase(1);
   });
   modalWindwo.on("hidden.bs.modal", function(event){
      event.preventDefault();
      resetNewProductForm();
   });
});

function validateNewProductForm(){
   var output = true;
   for(var [key, input] of Object.entries(inputArray)){
      var type = input.attr("type");
      var value = input.val();
      if(type === "text"){
         if(value === ""){
            $("#" + key + "Help").text("Este campo no puede estar vacío...");
            output = false;
         }else{
            $("#" + key + "Help").text("");
         }
      }else if(type === "number"){
         if(value === "" || value === 0){
            $("#" + key + "Help").text("Este campo no puede estar vacio y su valor debe ser mayor a cero...");
            output = false;
         }else{
            $("#" + key + "Help").text("");
         }
      }
   };
   return output;
}

function validateProductAmount(){
   var output = true;
   var amountVal = parseInt(amount.val(), 10);
   var amountMaxVal = parseInt(amountMax.val(), 10);
   var amountMinVal = parseInt(amountMin.val(), 10);
   if(amountVal < amountMinVal || amountVal > amountMaxVal){
      $("#amountHelp").text("La cantidad inicial de productos debe estar dentro de los limites de cantidad establecidos...");
      output = false;
   }
   return(output);
}

function validateProductExists(productName){
   var output = true;
   $.ajax({
      type: "POST",
      url: "php/validateProductExists.php",
      data: {productName: productName},
      async: false,
      success: function(response){
         if(parseInt(response, 10) !== 0){
            output = false;
         }
      }
   });
   return(output);
}

function makeChange(){
   var amountToOperateVal = parseInt(amountToOperate.val(), 10);
   var operation = changeButtonDropdown.text();
   var amountTemp = 0;
   var validated = false;
   if(amountToOperate.val() !== ""){
      if(operation === "Entrada"){
         amountTemp = parseInt(amountGlobal, 10) + amountToOperateVal;
         if(amountTemp > amountMaxGlobal){
            changeAmountHelp.text("El valor que desea agregar hace que la cantidad del producto supere el límite establecido...");
         }else{
            changeAmountHelp.text("");
            validated = true;
         }
      }else if(operation === "Salida"){
         amountTemp = parseInt(amountGlobal, 10) - amountToOperateVal;
         if(amountTemp < amountMinGlobal){
            changeAmountHelp.text("El valor que desea retirar hace que la cantidad del producto esté por debajo del límite establecido...");
         }else{
            changeAmountHelp.text("");
            validated = true;
         }
      }
   }else{
      changeAmountHelp.text("El campo no debe estar vacio y el valor ingresado debe ser mayor a cero...");
   }
   if(validated){
      $.ajax({
         type: "POST",
         url: "php/changeProductAmount.php",
         data:{
               id: idToEdit,
               operation: operation,
               currentAmount: parseInt(amountGlobal, 10),
               amountToOperate: amountToOperateVal
         },
         success: function(response){
            cancelChangingButton.trigger("click");
            resetChangeProductForm();
            loadDatabase(1);
         }
      });
   }
}

function loadDatabase(page, parameter = "", parameterVal = ""){
   $.ajax({
      type: "POST",
      url: "php/loadDatabase.php",
      data: {
         page: page,
         parameter: parameter,
         parameterVal: parameterVal
      },
      async: false,
      dataType: "html",
      success: function(response){
         tableBody.html(response);
      }
   });
   changePage(page, parameter, parameterVal);
}

function changePage(page, parameter = "", parameterVal = ""){
   currentPage = page;
   $.ajax({
      type: "POST",
      url: "php/pagination.php",
      data: {
         page: page,
         parameter: parameter,
         parameterVal: parameterVal
      },
      async: false,
      dataType: "html",
      success: function(response){
         pagination.html(response);
      }
   });
}

function deleteProduct(id){
   $.ajax({
      type: "POST",
      url: "php/deleteProduct.php",
      data: {id: id},
      success: function(){
         currentPage = 1;
         loadDatabase(1);
      }
   });
}

function consultProduct(id){
   var productData;
   $.ajax({
      type: "POST",
      url: "php/getProductData.php",
      data: {id: id},
      async: false,
      success: function(response){
         productData = response.split("{}");
      }
   });
   return(productData);
}

function getProductData(id){
   var productData = consultProduct(id);
   var i = 0;
   for(var [key, input] of Object.entries(inputArray)){
      if(input == productName){
         nameToEdit = productData[i].trim();
      }
      input.val(productData[i]);
      i++;
   }
}

function getProductLimits(id){
   var productData = consultProduct(id);
   amountGlobal = productData[3];
   amountMaxGlobal = productData[4];
   amountMinGlobal = productData[5];
   amountMaxLabel.text(amountMaxGlobal);
   amountMinLabel.text(amountMinGlobal);
   currentAmountLabel.text(amountGlobal);
}

function resetNewProductForm(){
   for(var [key, input] of Object.entries(inputArray)){
      $("#" + key + "Help").text("");
      input.val("");
   }
}

function resetChangeProductForm(){
   amountToOperate.val("");
   changeAmountHelp.text("");
   changeButtonDropdown.text("Entrada");
}