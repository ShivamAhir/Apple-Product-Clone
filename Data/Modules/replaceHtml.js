module.exports = function replaceHtml(template,product,section)
{
    let output=template.replace('{{%name%}}',product.name);
    output=output.replace('{{%size%}}',product.size);
    output=output.replace('{{%Display%}}',product.display);
    output=output.replace('{{%link%}}',product.link);
    //output=output.replace('{{%path%}}','/delete/'+product.id);


    if(product.bool==true)
    {
        output=output.replace('{{%stock%}}',"<h2 style='color:red'>Out of stock</h2>");
        output=output.replace('{{%price%}}',"");
    }
    else
    {
        output=output.replace('{{%stock%}}',"<h2 style='color:green'>In stock</h2>");
        output=output.replace('{{%price%}}',product.price);
    }
    
    output=output.replace("{{%button-id%}}",product.id);
    if(section!=null)
    output=output.replace('{{%id%}}',"/"+section+"/id="+product.id);
    return output;
}