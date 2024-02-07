//! DOM ACCESS
const total = document.getElementById("total");
const income = document.getElementById("income");
const expenses = document.getElementById("expenses");
const operator = document.getElementById("operator");
const description = document.getElementById("description");
const price = document.getElementById("price");
const submit = document.getElementById("confirm");
const clear = document.getElementById("clear");
const ıncomelist = document.getElementById("incomelist");
const expenseslist = document.getElementById("expenseslist");
//! DOM ACCESS
let totalValue = 0;
let incomeValue = 0;
let expensesValue = 0;
let oprValue = "";
let descValue = "";
let priceValue;
let incArr = [];//? İncome ları tutacak dizi
let expArr = [];//? Expenses ları tutacak dizi
let indexCounter1=0;//? İncome dizisi için id leri sayacak counter elemanı
let indexCounter2=0;//? Expenses dizisi için id leri sayacak counter elemanı
window.addEventListener("DOMContentLoaded", () => {
  //! Sayfa yüklendiğinde yerel depodan önceki(varsa) verileri alır ve ekrana yansıtır.
  const savedData = JSON.parse(localStorage.getItem("expenseTrackerData"));
  if (savedData) {
    totalValue = savedData.totalValue;
    incomeValue = savedData.incomeValue;
    expensesValue = savedData.expensesValue;
    incArr = savedData.incArr;
    expArr = savedData.expArr;
    indexCounter1 = incArr.length === 0 ? 0 :findBiggestID(incArr) + 1;
    indexCounter2 = expArr.length === 0 ? 0 : findBiggestID(expArr) + 1;
    displayValue.display();
    UI.calculate("+", 0);
    UI.calculate("-", 0);
  }
  else{
    displayValue.display();
  }
});
//! Sayfa yenilendikten sonra indexCounter değişkenlerini günceller.
function findBiggestID(array) {
  let ID = array[0].arrayid;
  for (let i = 1; i < array.length; i++) {
      if (array[i].arrayid > ID) {
        ID = array[i].arrayid;
      }
  }
  return ID;
}
class displayValue {
  //! Gelir ,gider ve toplam inputlarına değerleri yazar. 
  static display() {
    total.value = totalValue.toString() + "$";
    income.value = incomeValue.toString() + "$";
    expenses.value = expensesValue.toString() + "$";
  }
  //! Gelirler ya da gider tablosundan seçilen öğeyi siler ve gelir gider tablosunu ona göre günceller.
  static deleted(event, y) {
    if (y == 1) {
      incomeValue -= Number(event.target.value);
      totalValue -= Number(event.target.value);
      let btnID = event.target.dataset.id;
      event.target.parentElement.remove();
      displayValue.display();
      incArr = incArr.filter((item) => item.arrayid !== +btnID);
      if(incArr.length === 0)
      indexCounter1=0;
    } else {
      expensesValue -= Number(event.target.value);
      totalValue += Number(event.target.value);
      let btnID = event.target.dataset.id;
      event.target.parentElement.remove();
      expArr = expArr.filter((item) => item.arrayid !== +btnID);
      displayValue.display();
      if(expArr.length === 0)
      indexCounter2 = 0;
    }
    const expenseTrackerData = {
      totalValue,
      incomeValue,
      expensesValue,
      incArr,
      expArr,
    };
    localStorage.setItem("expenseTrackerData",JSON.stringify(expenseTrackerData));
  }
}
//! Temizle butonuna basıldığında listeyi temizleyen metodu çalıştırır.
clear.addEventListener("click", () => {
  UI.clearInput();
  displayValue.display();
  localStorage.removeItem("expenseTrackerData");
});
//! Onayla düğmesine basıldığında inputlardan seçilen verilere göre veriyi ilgili diziye aktarır aynı zamanda gelir gider tablosu ve listeyi günceller
submit.addEventListener("click", () => {
  //? İnputlarda boşluk girilirse hata verir.
  if (description.value.trim() === "" || price.value.trim() === "") {
    window.alert("Lütfen bir harcama bedeli ve açıklama ekleyiniz ");
    return;
  } else {
    descValue = description.value;
    oprValue = operator.value;
    priceValue = Number(price.value);
  }
  let arrid;
  if (oprValue == "+") {
    arrid = indexCounter1++;
    const arr = new totalArr(arrid, descValue, priceValue.toString());
    incArr.push(arr);
  } else if (oprValue == "-") {
    arrid = indexCounter2++;
    const arr = new totalArr(arrid, descValue, priceValue.toString());
    expArr.push(arr);
  }
  UI.calculate(oprValue, priceValue);
  displayValue.display();
  description.value = "";
  price.value = "";
  //!LOCAL STORAGE
  const expenseTrackerData = {
    totalValue,
    incomeValue,
    expensesValue,
    incArr,
    expArr,
  };
  localStorage.setItem("expenseTrackerData",JSON.stringify(expenseTrackerData));
  //!LOCAL STORAGE
});
//! Gelir gider değerlerini açıklamaları ve unıque id yi tutacak nesne.
class totalArr {
  constructor(arrayid, description, price) {
    this.arrayid = arrayid;
    this.description = description;
    this.price = price;
  }
}
class UI {
  //! Gelir ve giderleri hesaplar ve ekrana yansıtır.
  static calculate(opr, cash) {
    let result = "";
    switch (opr) {
      case "+":
        totalValue += cash;
        incomeValue += cash;
        result += `<h3 class="text-green-800">İNCOME</h3>`;
        incArr.forEach((items) => {
          result += `<div class="flex justify-between p-2 border  border-black"><span title="${items.description}" class="truncate">${items.description}</span> <span>${items.price}$</span> <button data-id="${items.arrayid}" onclick="displayValue.deleted(event,1)" value="${items.price}"  class="border border-red-600  bg-transparent px-4 py-1 rounded hover:bg-red-700 hover:text-white ">Sil</button></div>`;
        });
        ıncomelist.innerHTML = result;
        break;
      case "-":
        totalValue -= cash;
        expensesValue += cash;
        result += `<h3 class="text-red-800">EXPENSES</h3>`;
        expArr.forEach((item) => {
          result += `<div class="flex justify-between p-2 border border-black">${item.description} <span>${item.price}$</span> <button data-id="${item.arrayid}" onclick=" displayValue.deleted(event,2)" value="${item.price}"   class="border border-red-600  bg-transparent px-4 py-1 rounded hover:bg-red-700 hover:text-white ">Sil</button></div>`;
        });
        expenseslist.innerHTML = result;
        break;
    }
  }
  //!  Gelir gider ve toplamı sıfırlar ve listeyi temizler.
  static clearInput() {
    totalValue = 0;
    incomeValue = 0;
    expensesValue = 0;
    incArr = [];
    expArr = [];
    indexCounter1 = 0;
    indexCounter2 = 0;
    ıncomelist.innerHTML = `<h3 class="text-green-800">İNCOME</h3>`;
    expenseslist.innerHTML = `<h3 class="text-red-800">EXPENSES</h3>`;
  }
}
