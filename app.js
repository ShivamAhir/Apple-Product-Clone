const express=require('express');
const fs=require('fs');

const url=require('url');

let replaceHtml=require('./Data/Modules/replaceHtml.js')


const page=fs.readFileSync('index.html','utf-8');
const content=fs.readFileSync('content.html','utf-8');
const productDetail=fs.readFileSync('productDetail.html','utf-8');
const support=fs.readFileSync('support.html','utf-8');
const cartPage=fs.readFileSync('Buy.html','utf-8');
const cartBuy=fs.readFileSync('cart.html','utf-8');
const emptyPage=fs.readFileSync('EmptyCart.html','utf-8');
const gallery=fs.readFileSync('gallery.html','utf-8');
const pagenotfound=fs.readFileSync('page-not-found.html','utf-8');


const mac=JSON.parse(fs.readFileSync('Data/Mac.json','utf-8'));
const ipad=JSON.parse(fs.readFileSync('Data/iPad.json','utf-8'));
const iphone=JSON.parse(fs.readFileSync('Data/iPhone.json','utf-8'));
const watch=JSON.parse(fs.readFileSync('Data/Watch.json','utf-8'));
const airpord=JSON.parse(fs.readFileSync('Data/Airpord.json','utf-8'));
const buy=JSON.parse(fs.readFileSync('Data/Buy.json','utf-8'));

let app=express();

app.use(express.json());

const bodyParser = require('body-parser');
const { log } = require('console');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.status(200).send(page.replace('{{%CONTENT%}}',gallery));
});

app.get('/home',(req,res)=>{
    res.status(200).send(page.replace('{{%CONTENT%}}',gallery));
});

app.post('/delete', (req, res) => {
    let itemId = req.body.itemId;
    itemId=itemId*1;

    const buyToDelete=buy.find(el=>el.id==itemId);
    
    const index=buy.indexOf(buyToDelete);

    buy.splice(index,1);


    fs.writeFile('/Users/shivamahir/Desktop/Backend/Data/Buy.json',JSON.stringify(buy),(err)=>{
        res.status(204).redirect("home/buy");
    })
  });

app.post('/checkout',(req,res)=>{
    buy.splice(0,buy.length);

    
    fs.writeFile('/Users/shivamahir/Desktop/Backend/Data/Buy.json',JSON.stringify(buy),(err)=>{
        res.status(204).redirect("home");
    })
})

  app.post('/home/:option/:item', (req, res) => {
    const section = req.params.option;
    const newId = buy.length + 1;
    const index = parseInt(req.params.item.slice(3, 4));

    let selectedItem;

    switch (section) {
        case "mac":
            selectedItem = mac[index];
            break;
        case "ipad":
            selectedItem = ipad[index];
            break;
        case "iphone":
            selectedItem = iphone[index];
            break;
        case "watch":
            selectedItem = watch[index];
            break;
        case "airpord":
            selectedItem = airpord[index];
            break;
        default:
            return res.status(404).send(page.replace('{{%CONTENT%}}', "<h1>Page Not Found!!</h1>"));
    }

    if (selectedItem) {
        const newBuy = { ...selectedItem, id: newId };
        buy.push(newBuy);
        fs.writeFile('Data/Buy.json', JSON.stringify(buy), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Internal Server Error");
            }
            res.status(201).redirect(req.url);
        });
    }
});
app.post('/buy', (req, res) => {
    const currentUrl = req.body.current_url;
    var option="";
    var item="";
    let count=0;
    for(let i=0;i<currentUrl.length;i++)
    {
        if(currentUrl[i]=='/')
        {
            count++;
            continue;
        }
        else if(count==4 && currentUrl[i]!='/')
        option+=currentUrl[i];
        else if(count==5 && currentUrl[i]=='=')
        {
            item+=currentUrl[i+1];
            break;
        }
        
    }
    const section = option;
    const newId = buy.length + 1;
    item=item*1;
    const index = item;


    let selectedItem;

    switch (section) {
        case "mac":
            selectedItem = mac[index];
            break;
        case "ipad":
            selectedItem = ipad[index];
            break;
        case "iphone":
            selectedItem = iphone[index];
            break;
        case "watch":
            selectedItem = watch[index];
            break;
        case "airpord":
            selectedItem = airpord[index];
            break;
        default:
            return res.status(404).send(page.replace('{{%CONTENT%}}', "<h1>Page Not Found!!</h1>"));
    }
    if (selectedItem) {
        const newBuy = { ...selectedItem, id: newId };
        buy.push(newBuy);
        fs.writeFile('Data/Buy.json', JSON.stringify(buy), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Internal Server Error");
            }
            res.status(201).redirect('/home/buy');
        });
    }

  });
  



app.get('/home/:option/:item?',(req,res)=>{
    switch(req.params.option.toLocaleLowerCase())
    {
        case "mac":{
            if(!req.params.item)
            {
                let MacRecord=mac.map((prod)=>{
                    return replaceHtml(content,prod,"home/mac");
                });
                res.status(200).send(page.replace('{{%CONTENT%}}',MacRecord.join("")));
            }
            else
            {
                let index=req.params.item;
                index=index.slice(3,4);
                index=index*1;
                let prod=mac[index];
                let productDetailResponse=replaceHtml(productDetail,prod);
                res.status(200).send(page.replace('{{%CONTENT%}}',productDetailResponse));
            };
            break;
        }
        case "ipad":{
            if(!req.params.item)
            {
                let IpadRecord=ipad.map((prod)=>{
                    return replaceHtml(content,prod,"home/ipad");
                });
                res.status(200).send(page.replace('{{%CONTENT%}}',IpadRecord.join("")));
            }
            else
            {
                let index=req.params.item;
                index=index.slice(3,4);
                index=index*1;
                let prod=ipad[index];
                let productDetailResponse=replaceHtml(productDetail,prod);
                res.status(200).send(page.replace('{{%CONTENT%}}',productDetailResponse));
            };
            break;
        }
        case "iphone":{
            if(!req.params.item)
            {
                let IphoneRecord=iphone.map((prod)=>{
                    return replaceHtml(content,prod,"home/iphone");
                });
                res.status(200).send(page.replace('{{%CONTENT%}}',IphoneRecord.join("")));
            }
            else
            {
                let index=req.params.item;
                index=index.slice(3,4);
                index=index*1;
                let prod=iphone[index];
                let productDetailResponse=replaceHtml(productDetail,prod);
                res.status(200).send(page.replace('{{%CONTENT%}}',productDetailResponse));
            };
            break;
        }
        case "watch":{
            if(!req.params.item)
            {
                let WatchRecord=watch.map((prod)=>{
                    return replaceHtml(content,prod,"home/watch");
                });
                res.status(200).send(page.replace('{{%CONTENT%}}',WatchRecord.join("")));
            }
            else
            {
                let index=req.params.item;
                index=index.slice(3,4);
                index=index*1;
                let prod=watch[index];
                let productDetailResponse=replaceHtml(productDetail,prod);
                res.status(200).send(page.replace('{{%CONTENT%}}',productDetailResponse));
            };
            break;
        }
        case "airpord":{
            if(!req.params.item)
            {
                let AirpordRecord=airpord.map((prod)=>{
                    return replaceHtml(content,prod,"home/airpord");
                });
                res.status(200).send(page.replace('{{%CONTENT%}}',AirpordRecord.join("")));
            }
            else
            {
                let index=req.params.item;
                index=index.slice(3,4);
                index=index*1;
                let prod=airpord[index];
                let productDetailResponse=replaceHtml(productDetail,prod);
                res.status(200).send(page.replace('{{%CONTENT%}}',productDetailResponse));
            };
            break;
        }
        case "support":{
            res.status(200).send(page.replace('{{%CONTENT%}}',support));
            break;
        };
        case "buy":{
            if(buy.length==0)
            res.status(200).send(page.replace('{{%CONTENT%}}',emptyPage));

            let BuyRecord=buy.map((prod)=>{
                return replaceHtml(cartPage,prod,"home/buy");
            });
            const priceArr=[];
            for(let i=0;i<buy.length;i++)
            {
                priceArr.push(buy[i].price)
            }
            var totalPrice=0;
            for(let i=0;i<priceArr.length;i++)
            {
                var temp=priceArr[i];
                let sum=0;
                for(let j=0;j<temp.length;j++)
                {
                    if(temp[j]>='0' && temp[j]<='9')
                    {
                        sum*=10;
                        sum+=(temp[j]-"0");
                    }
                    else
                    continue;
                }
                totalPrice+=sum;
            }

            let CartBuyRecord=cartBuy.replace("{{%Shopping-Cart%}}",BuyRecord.join(""));
            CartBuyRecord=CartBuyRecord.replace("{{%item%}}",buy.length);
            CartBuyRecord=CartBuyRecord.replace("{{%amount%}}",totalPrice+" Rs");

            
            res.status(200).send(page.replace('{{%CONTENT%}}',CartBuyRecord));
            
            break;
        };
        default:{
            res.status(404).send(page.replace('{{%CONTENT%}}',pagenotfound));
        }
    }
});


const port=3000;
app.listen(port,()=>{
    console.log('server has started...');
})
