// storage controller

// item controller
const ItemCtrl = (function(){
   // Item Constructor 
   const Item = function(id, name, calories) {
      this.id = id;
      this.name = name;
      this.calories = calories;
   }

   // Data structure / State
   const data = {
      items: [
         // {id: 0, name: 'Steak Dinner', calories: 1200},
         // {id: 1, name: 'Cookie', calories: 400},
         // {id: 2, name: 'Eggs', calories: 300}
      ],
      currentItem: null,
      totalCalories: 0
   }

   // torna publicos os metodos
   return {
      getItems: function(){
         return data.items;
      },
      addItem: function(name, calories){
         let ID;
         // cria e define ID
         if (data.items.length > 0) {
            ID = data.items[data.items.length - 1 ].id + 1; // logica de auto incremento que leva em conta que arrays comecam contando a partir de 0
         } else {
            ID = 0;
         }

         // calories para numeros
         calories = parseInt(calories);

         newItem = new Item(ID, name, calories);

         // adiciona ao array de items
         data.items.push(newItem);

         return newItem;

      },
      logData: function(){
         return data;
      }
   }

})();

// ui controller
const UiCtrl = (function(){
   const UiSelectors = {
      itemList: '#item-list',
      addBtn: '.add-btn',
      itemNameInput: '#item-name',
      itemCaloriesInput: '#item-calories'
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

      },
      // pega input do form
      getItemInput: function(){
         return {
            name:document.querySelector(UiSelectors.itemNameInput).value,
            calories:document.querySelector(UiSelectors.itemCaloriesInput).value
         }
      },
      // torna publicos os querySelectors para os event listeners em App
      getSelectors: function(){
         return UiSelectors;
      },
      addListItem: function(item){
         // mosta o elemento <ul>
         document.querySelector(UiSelectors.itemList).style.display = 'block';
         // create li element
         const li = document.createElement('li');
         // adiciona classe no elemento li
         li.className = 'collection-item';
         // adiciona ID
         li.id = `item-${item.id}`;
         // addiciona html
         li.innerHTML = `
         <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
         <a href="#" class="secondary-content">
         <i class="edit-item fa fa-pen"></i>
         </a>
         `;
         // escreve o html
         document.querySelector(UiSelectors.itemList).insertAdjacentElement('beforeend', li)
      },
      clearInput: function(){
         document.querySelector(UiSelectors.itemNameInput).value = '';
         document.querySelector(UiSelectors.itemCaloriesInput).value = '';
      },
      // esconde o elemento <ul> quando não há itens na lista
      hideList: function(){
         document.querySelector(UiSelectors.itemList).style.display = 'none';
      }
   }
   
})();

// app controller
const App = (function(ItemCtrl, UiCtrl){
   // carrega todos os event listeners
   const loadEventListeners = function(){
      // pega os seletores de UI
      const UiSelectors = UiCtrl.getSelectors();

      // evento para adicionar itens
      document.querySelector(UiSelectors.addBtn).addEventListener('click', itemAddSubmit);
   }

   // submit de adicionar item
   const itemAddSubmit = function(e){
      // pega input do form de UiCtrl
      const input = UiCtrl.getItemInput();

      // verifica se há valor em Meal e Calories
      if (input.name !== '' && input.calories !== '') {
         // adiciona item na estrutura de dados
         const newItem = ItemCtrl.addItem(input.name, input.calories);
         // adiciona item na interface
         UiCtrl.addListItem(newItem);

         // limpa campos do formulario
         UiCtrl.clearInput();
      }

      e.preventDefault();
   }

   // torna publicos os metodos
   return {
      init: () => {
         console.log('Init OK');

         // avalia dados da estrutura de dados
         const items = ItemCtrl.getItems();

         // esconde elemento <ul> se houverem 0 itens
         if (items.length === 0) {
            UiCtrl.hideList();
         } else {
            // preenche lista com items
            UiCtrl.populateItemList(items);
         }


         // carrega eventListeners
         loadEventListeners();
      }
   }
})(ItemCtrl, UiCtrl);

// Inicia o app
App.init();