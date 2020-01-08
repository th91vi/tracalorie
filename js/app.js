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
   const Data = {
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

   }

})();

// ui controller
const UiCtrl = (function(){

   // torna publicos os metodos
   return {

   }
   
})();

// app controller
const App = (function(ItemCtrl, UiCtrl){

   // torna publicos os metodos
   return {
      init: () => {
         console.log('Initializing app...');
      }
   }
})(ItemCtrl, UiCtrl);

// Inicia o app
App.init();