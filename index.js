var AWS = require('aws-sdk');
var dynamo = new AWS.DynamoDB.DocumentClient({region:'us-east-1'});

exports.handler = async (event,callback)=>{
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    if(event.httpMethod == 'GET'){

        return getItem(event,callback);
    }
    if(event.httpMethod == 'POST'){

        return postItem(event,callback);
    }
}
function response(code,message){
    return {statusCode:code,body:JSON.stringify(message)};
}
 
async function getItem(event, callback){
    
    let params = {
        TableName:"shopItems"
    };
    var items = [];
    await dynamo.scan(params).promise().then((data)=>{
    data.Items.forEach(function(item){items.push(item);
        })}).catch(err=>response(err.statusCode,err));
   
    return {statusCode: 200, body:JSON.stringify(items)};
}

function postItem(event,callback) {
  
    let item = {
        id:event.body.id,
        description: event.body.description,
        colour: event.body.colour,
        size: event.body.size,
        price: event.body.price
    };

    return dynamo.put({
        TableName:"shopItems",
        Item:item,
    }).promise().then(()=>{
        callback(null,{statusCode:201,body:JSON.stringify(item)})
    }).catch(err => response(err.statusCode,err));

} 

