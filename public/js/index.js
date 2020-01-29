function loadComments(){
    let url = '/blog-api/comentarios';
    let settings = {
        method: "GET"
    }

    fetch(url, settings)
        .then(response=>{
            if(response.ok){
                return response.json();
            }
        })
        .then( (responseJSON) =>{
            displayResults(responseJSON,'#comentarios');
        })
}

function displayResults(responseJSON, contenedor){

    
    $(contenedor).empty();
    for(let i=0; i<responseJSON.length;i++){
        
        let titulo = document.createElement('h3');
        $(titulo).text(responseJSON[i].titulo);
        let comentario = document.createElement('p');
        $(comentario).text(responseJSON[i].contenido);
        let fecha = document.createElement('div')
        fecha.setAttribute("class", "fecha");
        let date = responseJSON[i].fecha;
        fecha.innerHTML = new Date(date).toDateString();
        let autor = document.createElement('div')
        autor.setAttribute("class", "autor");
        $(autor).text(responseJSON[i].autor);
        let id = document.createElement('div');
        id.setAttribute('class', 'id');
        $(id).text(responseJSON[i].id);
        let item = document.createElement('div');
        item.setAttribute("class", 'item');

        $(item).append(titulo, comentario, fecha, autor, id);
        $(contenedor).append(item);
    }

}

function authorSearch(){
    
    $('#formaAutor').on('submit', (event)=>{
        event.preventDefault();
        if($("#autorBuscar").val()!=""){
            let url = '/blog-api/comentarios-por-autor?autor='+$("#autorBuscar").val();
            let settings = {
                method: "GET"
            }
            
            fetch(url, settings)
                .then(response=>{
                    
                    if (response.ok){
                        return response.json();
                    }
                })
                .catch(error=>{
                    console.log(error)
                    throw Error(error);
                })
                .then(responseJSON=>{
                    displayResults(responseJSON, '#comentariosAutor')
                })

            $("#autorBuscar").val('');
           
                
        }
    })
}

function updateComment(){
    $('#formaActualizar').on('submit', (event)=>{
        event.preventDefault();
        if($("#id").val()!=""){

            let url = '/blog-api/actualizar-comentario/' + $('#id').val();
            let id = $("#id").val();
            let titulo = $("#titulo").val() ||undefined;
            let autor = $("#autor").val()||undefined;
            let contenido = $("#contenido").val()||undefined;
            let date =  new Date();

            let obj = {
                id:id,
                titulo:titulo ,
                autor: autor,
                contenido:contenido ,
                fecha: date.toISOString()
            }
            //console.log(obj)
            
            $.ajax({
                url: url,
                method: 'PUT',
                contentType: "application/json",
                data: JSON.stringify(obj),
                
                //dataType: "json",
                success: function () {
                    
                    loadComments();
                },
                error: function (error) {
                    console.log(error);
                }
            })

            $("#id").val("");
            $("#titulo").val("");
            $("#autor").val('');
            $("#contenido").val('');

        }
        
    })

    


}


function newComment(){
    $('#formaNuevo').on('submit', (event)=>{
        event.preventDefault();
        if($("#tituloNuevo").val()!="" && $("#autorNuevo").val()!="" && $("#contenidoNuevo").val()!=""){

            let url = '/blog-api/nuevo-comentario' ;
            
            let titulo = $("#tituloNuevo").val();
            let autor = $("#autorNuevo").val();
            let contenido = $("#contenidoNuevo").val();
            let date =  new Date();

            let obj = {
                
                titulo:titulo ,
                autor: autor,
                contenido:contenido ,
                
            }
            
            
            $.ajax({
                url: url,
                method: 'POST',
                contentType: 'application/json',
                data:JSON.stringify(obj),//{titulo, autor, contenido}),
                
                //dataType: "json",
                success: function () {
                    
                    loadComments();
                },
                error: function (error) {
                    console.log(error);
                }
            })

            
            $("#tituloNuevo").val("");
            $("#autorNuevo").val('');
            $("#contenidoNuevo").val('');
        }
        
    })
}


function delComment(){
    $('#formaRemover').on('submit', (event)=>{
        event.preventDefault();
        if($("#idRemover").val()!=""){
            let url = '/blog-api/remover-comentario/'+$("#idRemover").val();
            
            
            $.ajax({
                method: 'DELETE',
                url: url,
                
                
                dataType: "json",
                success: function (responseJSON) {
                    console.log(responseJSON);
                    loadComments();
                },
                error: function (error) {
                    console.log(error);
                }
            })

            $("#idRemover").val("");
            
                
                
        }
    })
}

function init(){
    authorSearch();
    loadComments();
    updateComment();
    newComment();
    delComment();
}


init();