const database = require("../main/datbase");



module.exports = {
    printInventory
};

module.exports = function printInventory(Bar_code) { 
    let calculate_res=calculate(Bar_code);
    checkpromotion(calculate_res);



};
function calculate(Bar_code){
    let res=[];
    let codes=[];
    let items=database.loadAllItems();
    for (let code of Bar_code)
    {
        for(let item of items)
        {
        if(code.length>11){//the bar-code include quantity
        codes=code.split("-");
        if(item.barcode===codes[0]){//get the information of the item
        if (res.barcode.indexOf(codes[0])===-1){// whether the item has existed in the res
            let object=item;
            object.count+=codes[1];
            res.push(object);
        }
            res.barcode[indexOf(codes[0])].count+=codes[1];
        }
    }
        else{
            if(item.barcode===code){
                if (res.barcode.indexOf(code)===-1){// whether the item has existed in the res
                    let object=item;
                    object.count=1;
                    res.push(object);
                }
                res.barcode[indexOf(code)].count++;

            }
    }
    
}
}
    for(item of res)
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
    console.log('***<没钱赚商店>购物清单***\n')
    for(let item of calculate_res)
    {
        console.log('名称：'+item.name+'，数量：'+item.count+item.unit+'，单价：'+item.price.toFixed(2)+'(元)，小计：'+item.money.toFixed(2)+'(元)\n');
    }
    console.log('----------------------\n'+'挥泪赠送商品：\n');
    for(let item in promotioncount){
        console.log('名称：'+item.name+'，数量：'+item.count+item.unit+'\n');
    }
    console.log('----------------------\n'+'总计：'+total.toFixed(2)+'(元)\n'+'节省：'+save.toFixed(2)+'(元)\n'+'**********************')


}