// storage controller

// item controller
const ItemCtrl = (function(){
   // Item Constructor 
   const Item = (id, name, calories) => {
      this.id = id;
      this.name = name;
      this.calories = calories;
   }

   // Data structure / State
   const data = {
      items: [
         {id: 0, name: 'Steak Dinner', calories: 1200},
         {id: 1, name: 'Cookie', calories: 400},
         {id: 2, name: 'Eggs', calories: 300}
      ],
      currentItem: null,
      totalCalories: 0
   }

   // torna publicos os metodos
   return {
      getItems: function(){
         return data.items;
      }
   }

})();

// ui controller
const UiCtrl = (function(){
   const UiSelectors = {
      itemList: '#item-list'
   }

   // torna publicos os metodos
   return {
      populateItemList: function(items){ // este metodo é chamado assim que a página carrega
         // let html;
         let html = ''; // apenas declarar a variavel deixa seu tipo como undefined; a declaramos abaixo como uma STRING vazia
         
         items.forEach(function(item){
            html += `
               <li class="collection-item" id="item-${item.id}">
                  <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                  <a href="#" class="secondary-content">
                     <i class="edit-item fa fa-pen"></i>
                  </a>
               </li>
            `
         });

         // insere lista de items
         // document.querySelector('item-list').innerHTML = html; // seletor pode mudar, então foi melhor criar um objeto para lidar com os seletores
         document.querySelector(UiSelectors.itemList).innerHTML = html;
      }
   }
   
})();

// app controller
const App = (function(ItemCtrl, UiCtrl){

   // torna publicos os metodos
   return {
      init: () => {
         console.log('Init OK');

         // avalia dados da estrutura de dados
         const items = ItemCtrl.getItems();

         // preenche lista com items
         UiCtrl.populateItemList(items);
      }
   }
})(ItemCtrl, UiCtrl);

// Inicia o app
App.init();