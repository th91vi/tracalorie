// storage controller
const StorageCtrl = (function(){
   // torna publicos os metodos
   return {
      storeItem: function(item){
         let items;

         // verifica se existem itens em localStorage
         if (localStorage.getItem('items') === null) {
            items = [];

            // insere novo item
            items.push(item);

            // define items e armazena em localStorage, como string
            localStorage.setItem('items', JSON.stringify(items));
         } else {
            // pega items armazenado em localStorage e o converte em um objeto javascript
            items = JSON.parse(localStorage.getItem('items'));

            // redefine items e armazena em localStorage, como string
            localStorage.setItem('items', JSON.stringify(items));
         } 
      },
      
      getItemsFromStorage: function(){
         let items;

         // verifica se existem itens em localStorage
         if (localStorage.getItem('items') === null) {
            items = [];
         } else {
            // pega items armazenado em localStorage e o converte em um objeto javascript
            items = JSON.parse(localStorage.getItem('items'));
         }

         return items;
      }
   }
})();

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
      items: StorageCtrl.getItemsFromStorage(),
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

      getItemById: function(id){
         let found = null;

         // avalia os items
         data.items.forEach(function(item){
            if(item.id === id){
               found = item;
            }
         })

         // retorna item atraves da variavel found
         return found;
      },

      updateItem: function(name, calories){ // os parametros desta funcao estao vindo dos valores da variavel "input", definada na funcao "itemUpdateSubmit"
         // transforma valores do input em numero 
         calories = parseInt(calories);

         let found = null;

         data.items.forEach(function(item){
            if (item.id === data.currentItem.id) {
               item.name = name;    
               item.calories = calories;
               found = item;     
            }
         });

         // atualiza item na estrutura de dados
         return found;
      },

      deleteItem: function(id){
         const ids = data.items.map(function(item){
            return item.id; // retorna um array de ids
         });
         console.log(ids);

         // pega indice da id
         const index = ids.indexOf(id);

         // remove item da estrutura de dados
         data.items.splice(index,1);

         // pega total de calorias
         const totalCalories = ItemCtrl.getTotalCalories();
         // atualiza total de calorias na interface
         UiCtrl.showTotalCalories(totalCalories);

         // encerra estado de edicao
         UiCtrl.clearEditState();
      },

      clearAllItems: function(){
         data.items = [];
      },

      setCurrentItem: function(item){
         data.currentItem = item;
      },

      getCurrentItem: function(){
         return data.currentItem;
      },

      getTotalCalories: function(){
         let total = 0;

         // passa atraves dos itens e suas calorias
         data.items.forEach(function(item){
            total += item.calories;
         });

         // define total de calorias na estrutura de dados
         data.totalCalories = total;

         // retorna total de calorias
         return data.totalCalories;
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
      listItems: '#item-list li',
      addBtn: '.add-btn',
      updateBtn:'.update-btn',
      deleteBtn:'.delete-btn',
      backBtn:'.back-btn',
      clearBtn: '.clear-btn',
      itemNameInput: '#item-name',
      itemCaloriesInput: '#item-calories',
      totalCalories: '.total-calories'
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

      updateListItem: function(updatedItem){
         let listItems = document.querySelectorAll(UiSelectors.listItems); // retorna uma nodelist

         // converte nodelist em um array
         listItems = Array.from(listItems);

         listItems.forEach(function(listItem){
            const itemId = listItem.getAttribute('id');

            if (itemId === `item-${updatedItem.id}`) {
               document.querySelector(`#${itemId}`).innerHTML = `
               <strong>${updatedItem.name}: </strong> <em>${updatedItem.calories} Calories</em>
               <a href="#" class="secondary-content">
               <i class="edit-item fa fa-pen"></i>
               </a>
               `;
            }
         })
      },

      deleteListItem: function(id){
         const itemId = `#item-${id}`;
         const item = document.querySelector(itemId);
         item.remove();
      },

      removeItems: function(){
         let listItems = document.querySelectorAll(UiSelectors.listItems);

         // transforma nodelist de listItems em array
         listItems = Array.from(listItems);

         listItems.forEach(function(item){
            item.remove();
         })
      },

      // mostra total de calorias na interface
      showTotalCalories: function(totalCalories){
         document.querySelector(UiSelectors.totalCalories).textContent= totalCalories;
      },

      // limpa os campos do formulario apos submeter item
      clearInput: function(){
         document.querySelector(UiSelectors.itemNameInput).value = '';
         document.querySelector(UiSelectors.itemCaloriesInput).value = '';
      },

      // insere propriedades do item no form ao editar
      addItemToForm: function(){
         document.querySelector(UiSelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
         document.querySelector(UiSelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

         // exibe item de editar na interface
         UiCtrl.showEditState();
      },

      // esconde o elemento <ul> quando não há itens na lista
      hideList: function(){
         document.querySelector(UiSelectors.itemList).style.display = 'none';
      },

      clearEditState: function(){
         UiCtrl.clearInput();

         // esconde os botoes de update, delete e back; quando nao estiver em edit state
         document.querySelector(UiSelectors.updateBtn).style.display = 'none';
         document.querySelector(UiSelectors.deleteBtn).style.display = 'none';
         document.querySelector(UiSelectors.backBtn).style.display = 'none';
         document.querySelector(UiSelectors.addBtn).style.display = 'inline';
      },

      showEditState: function(){
         document.querySelector(UiSelectors.updateBtn).style.display = 'inline';
         document.querySelector(UiSelectors.deleteBtn).style.display = 'inline';
         document.querySelector(UiSelectors.backBtn).style.display = 'inline';
         document.querySelector(UiSelectors.addBtn).style.display = 'none';
      }
   }

})();

// app controller
const App = (function(ItemCtrl, StorageCtrl, UiCtrl){
   // carrega todos os event listeners
   const loadEventListeners = function(){
      // pega os seletores de UI
      const UiSelectors = UiCtrl.getSelectors();

      // evento para adicionar itens
      document.querySelector(UiSelectors.addBtn).addEventListener('click', itemAddSubmit);

      // desabilita tecla enter para submit, para evitar que a acao errada seja acionado ao apertar enter\
      document.addEventListener('keypress', function(e){
         if(e.keyCode === 13 || e.which === 13){ // aqui usamos e.which como fallback para navegadores velhos
            e.preventDefault();
            return false;
         }
      })

      // evento para editar ao clicar no icone de editar; eh uma selecao indireta (event delegation), pois o elemento so eh criado apos a pagina ser carregada
      document.querySelector(UiSelectors.itemList).addEventListener('click', itemEditClick);

      // evento de atualizacao de item
      document.querySelector(UiSelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
      
      // evento de delete de item
      document.querySelector(UiSelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
      
      // evento do botao de voltar, para limpar o estado de edicao
      document.querySelector(UiSelectors.backBtn).addEventListener('click', UiCtrl.clearEditState);

      // evento de apagar todos os itens
      document.querySelector(UiSelectors.clearBtn).addEventListener('click', clearAllItemsClick);
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

         // pega total de calorias
         const totalCalories = ItemCtrl.getTotalCalories();
         // adiciona total de calorias na interface
         UiCtrl.showTotalCalories(totalCalories);

         // ar mazena em localStorage
         StorageCtrl.storeItem(newItem);
         
         // limpa campos do formulario
         UiCtrl.clearInput();
      }

      e.preventDefault();
   }

   const itemEditClick = function(e){
      // torna especifico o clique no icone de editar, senao o evento dispara ao clicar em qualquer lugar da lista
      if(e.target.classList.contains('edit-item')){
         // pega id do item na lista, que eh o 'avo' do icone de editar
         const listId = e.target.parentNode.parentNode.id;

         // faz split e transforma a string recebida do elemento HTML (e.target.parentNode.parentNode.id) em um array, para depois extrairmos apenas o numero de id
         const listIdArr = listId.split('-');

         // pega o numero da id
         const id = parseInt(listIdArr[1]);

         // pega id do item
         const itemToEdit = ItemCtrl.getItemById(id);

         // define item a ser editado como currentItem
         ItemCtrl.setCurrentItem(itemToEdit);

         // insere propriedades do item no form
         UiCtrl.addItemToForm();
      }
      e.preventDefault();
   }

   const itemUpdateSubmit = function(e){
      // pega valores nos campos do form
      const input = UiCtrl.getItemInput();

      // atualiza item; input abaixo eh a variavel declarada acima
      const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

      // atualiza valores na interface
      UiCtrl.updateListItem(updatedItem);
      e.preventDefault();

      // pega total de calorias
      const totalCalories = ItemCtrl.getTotalCalories();
      // atualiza total de calorias na interface
      UiCtrl.showTotalCalories(totalCalories);

      // encerra estado de edicao
      UiCtrl.clearEditState();
   }

   // evento do botao de delete 
   const itemDeleteSubmit = function(e){
      // pega id de current item
      const currentItem = ItemCtrl.getCurrentItem();

      // apaga da estrutura de dados
      ItemCtrl.deleteItem(currentItem.id);

      // apaga da interface
      UiCtrl.deleteListItem(currentItem.id);

      e.preventDefault();
   }

   // evento que apaga todos os itens
   const clearAllItemsClick = function(){
      // apaga todos os itens da estrutura de dados
      ItemCtrl.clearAllItems();

      // remove todos os itens da interface
      UiCtrl.removeItems();

      // pega total de calorias
      const totalCalories = ItemCtrl.getTotalCalories();
      // atualiza total de calorias na interface
      UiCtrl.showTotalCalories(totalCalories);

      // esconde elemento ul, tirando a linha embaixo do total de calorias
      UiCtrl.hideList();
   }

   // torna publicos os metodos
   return {
      init: () => {
         console.log('Init OK');

         // estado inicial, com edit state limpo
         UiCtrl.clearEditState();

         // avalia dados da estrutura de dados
         const items = ItemCtrl.getItems();

         // esconde elemento <ul> se houverem 0 itens
         if (items.length === 0) {
            UiCtrl.hideList();
         } else {
            // preenche lista com items
            UiCtrl.populateItemList(items);
         }

         // ao utilizar localStorage, insere os itens em localStorage na interface
         // pega total de calorias
         const totalCalories = ItemCtrl.getTotalCalories();
         // adiciona total de calorias na interface
         UiCtrl.showTotalCalories(totalCalories);

         // carrega eventListeners
         loadEventListeners();
      }
   }
})(ItemCtrl, StorageCtrl, UiCtrl);

// Inicia o app
App.init();