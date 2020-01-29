let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let comment = mongoose.Schema({
    id:{type:String},
    titulo:{type:String},
    autor:{type:String},
    contenido: {type:String},
    fecha:{type:Date}
});

let Comments = mongoose.model('comments', comment);

let CommentList = {
    getAll: function(){
        return Comments.find()
        .then(comments=>{return comments})
        .catch(error=>{throw error});
    },
    getByAttr: function(attr){
        return Comments.find(attr).then(result=>{
            return result;
        })
        .catch(error=>{
            throw error;
        })
    },
    create: function(obj){
        return Comments.create({id: obj.id, autor:obj.autor, titulo:obj.titulo, contenido:obj.contenido, fecha:obj.fecha})
        .then(nuevo=>{
            return nuevo;
        })
        .catch(error=>{
            throw error;
        })
    },
    update: function (obj){
        return Comments.findOneAndUpdate({id: obj.id}, {autor:obj.autor, titulo:obj.titulo, contenido:obj.contenido, fecha:obj.fecha}, {omitUndefined:true, new:true}).then(nuevo=>{return nuevo}).catch(error=>{throw error});
    },
    remove: function (query){
        return Comments.deleteOne(query, function (err){if (err)return err})
    }
}

module.exports = {
    CommentList
}