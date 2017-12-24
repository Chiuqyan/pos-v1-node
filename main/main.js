const database = require("../main/datbase");


module.exports = {
    printInventory
};

function printInventory(inputs) {

    let item = countItem(inputs);
    let itemA = Price(item);
    let gift = gifts(itemA);
    let list = printer(itemA, gift);
    console.log(list);
}


function splitcode(code) {
    let result = [];
    if (code.indexOf("-") != -1) {
        let result = code.split("-");
    } else {
        result.push(code);
        result.push(1);
    }
    return result;
}

// 
function countItem(item) {
    var res = [];
    var flag = false;
    var result;
    for (let itemA of item) {
        flag = false;
        result = splitcode(itemA);

        for (let itemB of res) {
            if (itemB.barcode === result[0]) {
                itemB.count += result[1];
                flag = true;
                break;
            }
        }
        if (flag === false) {
            res.push({ barcode: result[0], count: result[1] });
        }
    }
    let itemlist = database.loadAllItems();

    for (let itemA of item) {
        for (let itemB of itemlist) {
            if (itemA.barcode === itemB.barcode) {
                itemA.name = itemB.name;
                itemA.unit = itemB.unit;
                itemA.price = itemB.price;

            }
        }
    }
    return res;
}

function promotionreduce(item) //reduce
{
    let itemlist = database.loadPromotions();
    let num;
    let total;
    for (let itemA of itemlist) {
        if (itemA.type === "BUY_TWO_GET_ONE_FREE") {
            if (itemA.barcodes.indexOf(item.barcode) != -1)
                num = item.count - parseInt(item.count / 3);
            else
                num = item.count;
        }
        total = num * item.price;
    }
    return total;
}

function Price(item) {
    let itemlist = database.loadAllItems();
    for (let itemA of item) {
        for (let itemB of itemlist) {
            if (itemA.barcode === itemB.barcode) {
                itemA.total = promotionreduce(itemA);
            }
        }
    }
    return item;
}

function gifts(item) {
    let gift = [];
    for (let itemA of item) {
        if (itemA.price * itemA.count > itemA.total) {
            gift.push({ name: itemA.name, count: (itemA.price * itemA.count - itemA.total) / itemA.price, unit: itemA.unit, price: itemA.price });
        }
    }
    return gift;
}

function printlista(item) {
    let res = "";
    res = `名称：` + item.name + `，数量：` + String(item.count) + item.unit +
        `，单价：` + String(item.price.toFixed(2)) + `(元)，小计：` +
        String(item.total.toFixed(2)) + `(元)\n`;
    return res;
}

function printlistb(item) {
    let res = "";
    res = `名称：` + item.name + `，数量：` + String(item.count) + item.unit + `\n`;
    return res;
}

function printer(item, gifts) {
    let list = `***<没钱赚商店>购物清单***\n`;
    let sum = 0;
    let save = 0;

    for (let Item of item) {
        list += printlista(Item);
        sum += Item.subtotal;
    }
    list += `----------------------\n` + `挥泪赠送商品：\n`;
    for (let gift of gifts) {
        res += printlistb(gift);
        save += gift.count * gift.price;
    }
    list += `----------------------\n`;
    list += `总计：` + String(sum.toFixed(2)) + `(元)\n`;
    list += `节省：` + String(save.toFixed(2)) + `(元)\n`;
    list += `**********************`;

    return list;
}