const database = require("../main/datbase");


module.exports = {
    printInventory
};

function printInventory(inputs) {

    let item = count(inputs);
    let gift = gifts(item);
    let res = printer(item, gift);
    console.log(res);

}

function splitcode(str) {
    let result = [];
    if (str.indexOf("-") != -1) {
        result = str.split("-");
    } else {
        result.push(str);
        result.push(1);
    }
    return result;
}

function count(item) {
    let res = [];
    let flag = false;
    let result;
    for (let itemA of item) {
        flag = false;
        result = splitcode(itemA);

        for (let items of res) {
            if (items.barcode === result[0]) {
                items.count += result[1];
                flag = true;
                break;
            }
        }
        if (flag === false) {
            res.push({ barcode: result[0], count: result[1] });
        }
    }
    let list = database.loadAllItems();

    for (let itemA of res) {
        for (let itemB of list) {
            if (itemA.barcode === itemB.barcode) {
                itemA.name = itemB.name;
                itemA.unit = itemB.unit;
                itemA.price = itemB.price;
                itemA.total = promotionreduce(itemA);
            }
        }
    }
    return res;
}

function promotionreduce(item) {
    let list = database.loadPromotions();
    let num;
    let total;
    for (let itemA of list) {
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

function printer(items, gifts) {
    let res = `***<没钱赚商店>购物清单***\n`;
    let sum = 0;
    let save = 0;

    for (let item of items) {
        res += printlista(item);
        sum += item.total;
    }
    res += `----------------------\n` + `挥泪赠送商品：\n`;
    for (let gift of gifts) {
        res += printlistb(gift);
        save += gift.count * gift.price;
    }
    res += `----------------------\n`;
    res += `总计：` + String(sum.toFixed(2)) + `(元)\n`;
    res += `节省：` + String(save.toFixed(2)) + `(元)\n`;
    res += `**********************`;

    return res;
}