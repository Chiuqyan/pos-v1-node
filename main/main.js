const database = require("../main/datbase");



module.exports = {
    printInventory
};

function printInventory(Bar_code) { 
    let calculate_res=calculate(Bar_code);
    let promotioncount=checkpromotion(calculate_res);
    printer(calculate_res,promotioncount);
};
function calculate(Bar_code){
    let res=[];
    let codes=[];
    let items=database.loadAllItems();
    for (let code of Bar_code)
    {
        for(let item of items)
        {
        if(code.length>11)
        {//the bar-code include quantity
            codes=code.split("-");
            if(item.barcode===codes[0]){//get the information of the item
            for(let object in res){
                if (object.barcode===codes[0]){//find the item has existed in the res
                object.count+=codes[1];
                } 
                item.count+=codes[1];
                res.push(item);
            }
            res.barcode[indexOf(codes[0])].count+=codes[1];
        }
    }
        else{
            if(code === item.barcode){
                for(let object in res){
                    if (object.barcode===code){//find the item has existed in the res
                    object.count++;
                    } 
                    else{
                        item.count=1;
                        res.push(item);
                    }
                }
            }
    }
    
}
}
    for(let item of res)//original
    {
        item.money=parseFloat(item.count)*item.price;
    }
    return res;
}
function checkpromotion (calculate_res){
    let promotions=database.loadPromotions();
    let promotioncount=[];
    for(let promotion of promotions.barcodes)
    {
        for (let item of calculate_res)
        {
            if(item.barcode===promotion)
            {
                item.giftnum=parseFloat(item.count/2.0);
                item.giftvalue=item.giftnum*item.price;
                item.money-=item.giftvalue; 
                promotioncount.push(item);
            }

        }
    }
    return promotioncount;
}
function printer(calculate_res,promotioncount){
    let total=0;
    let save=0;
    for(let item of calculate_res){
        total+=item.money;
    }
    for(let item of promotioncount)
    {
        save+=item.giftvalue;
    }
    console.log('***<没钱赚商店>购物清单***')
    for(let item of calculate_res)
    {
        console.log('名称：'+item.name+'，数量：'+item.count+item.unit+'，单价：'+item.price.toFixed(2)+'(元)，小计：'+item.money.toFixed(2)+'(元)');
    }
    console.log('----------------------\n'+'挥泪赠送商品：');
    for(let item in promotioncount){
        console.log('名称：'+item.name+'，数量：'+item.count+item.unit);
    }
    console.log('----------------------\n'+'总计：'+total.toFixed(2)+'(元)\n'+'节省：'+save.toFixed(2)+'(元)\n'+'**********************')


}
