//Storage Controller
const StorageCtrl = (function(){


    return{
        storeItem: function(item){
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
                
                items.push(item);

                localStorage.setItem('items',JSON.stringify(items));
            }else{
                items = JSON.parse(localStorage.getItem('items'));

                items.push(item);

                localStorage.setItem('items',JSON.stringify(items));
            }
            
        },

        getItemsFromLS: function(){

            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
                
            }else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },

        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));
            console.log(items);

            items.forEach((item,index)=>{
                if (updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });

            localStorage.setItem('items',JSON.stringify(items));

        },

        deleteItemFromLS: function(id){
            let items = JSON.parse(localStorage.getItem('items'));
            console.log(items);

            items.forEach((item,index)=>{
                if (id === item.id) {
                    items.splice(index, 1);
                }
            });

            localStorage.setItem('items',JSON.stringify(items));
        },

        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }

    }
})();

//Item Controller
const ItemCtrl=(function () {
    //item constructor
    const Item = function (id,name,calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data Structure /State
    const data = {
        items: StorageCtrl.getItemsFromLS(),
        
        // [
        //     // {id: 0, name: 'steak', calories:1000},
        //     // {id: 1, name: 'steak2', calories:2000},
        //     // {id: 2, name: 'steak3', calories:400},
        // ],
        
        currentItem: null,
        totalCalories: 0
    }
    
    //Pubic methods
    return {
        getItems: function(){
            return data.items;
        },

        addItem: function(name, calories){
            //Create id
            let ID;
            if (data.items.length > 0) {
                ID = data.items[data.items.length-1].id + 1;
            }else{
                ID = 0;
            }

            //calories to number
            calories = parseInt(calories);

            // create new item 
            newItem = new Item(ID, name, calories);

            data.items.push(newItem);
            return newItem;
        },

        getItemById: function (id) {
            let found = null;
            
            data.items.forEach(function (item) {
                if (item.id === id) {
                    found = item;
                }
            });

            return found;
        },

        updateItem: function(name, calories){
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(item =>{
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item; 
                }
            });

            return found;
        },

        deleteItem: function (id){
            const ids = data.items.map(function(item){
                return item.id;
            });

            //get index
            const index = ids.indexOf(id);

            data.items.splice(index,1);
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

            data.items.forEach(function (item) {
                total += item.calories;                
            });

            //Set total calories data structure
            data.totalCalories = total;

            return data.totalCalories;
        },

        logData: function () {
            return data;
        }
    }
})();

//UI Controller
const UICtrl=(function () {

    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addbtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCalories: '#item-calories',
        totalCalories: '.total-calories',
        updateBtn: '.update-btn',
        deleteBtn:'.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn'
    }

    return {
        // fil the list 
        populateItemList: function (items) {
            let html ='';

            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>`;
            });

            //insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        //get item input
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCalories).value
            }
        },

        //make public selectors
        getSelectors:function(){
            return UISelectors;
        },

        //add new item
        addListItem: function (item) {

            //show list
            document.querySelector(UISelectors.itemList).style.display = 'block';

            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;

            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
            
        },

        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //turn node to array
            listItems = Array.from(listItems);
            //
            listItems.forEach(listItem =>{
                const itemID = listItem.getAttribute('id');

                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            });
        },

        deleteListItem: function (id) {
          const itemID = `#item-${id}`;
          const item = document.querySelector(itemID);
          item.remove();
        },

        //add item to form 
        addItemToForm: function () {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCalories).value = ItemCtrl.getCurrentItem().calories;

            UICtrl.showEditState();
        },

        //show total calories 
        showTotalCalories: function (total) {
            document.querySelector(UISelectors.totalCalories).textContent = total;
        },
        //hide empty list tag
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },

        //remove items
        removeItems: function () {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            //turn node to array
            listItems = Array.from(listItems);
            //
            listItems.forEach(item =>{
                item.remove();
            });

        },

        //clear input 
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCalories).value = '';
        },

        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addbtn).style.display = 'none';
        },

        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addbtn).style.display = 'inline';

        }
    }
    
})();

//App Controller
const App = (function (ItemCtrl, UICtrl, StorageCtrl) {

    //Load event listeners
    const loadEventListeners = function(){
        const UISelectors = UICtrl.getSelectors();

        //add item event 
        document.querySelector(UISelectors.addbtn).addEventListener('click', itemAddSubmit);

        //disable submit on enter
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
            
        });

        //edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        //Update item submit
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        //delete item submit
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        //back btn submit
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        //back btn submit
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

    }

    //Add item submit
    const itemAddSubmit = function (e) {
        
        //get from input from UI CTRL
        const input = UICtrl.getItemInput();
        console.log(input);

        //check for name calories input
        if(input.name !== '' && input.calories !== ''){
            //add item
            const newItem = ItemCtrl.addItem( input.name, input.calories);

            //add to UI
            UICtrl.addListItem(newItem);

            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //add to UI
            UICtrl.showTotalCalories(totalCalories);

            //Store in LS
            StorageCtrl.storeItem(newItem);
            //clear fields 
            UICtrl.clearInput();
        }
        e.preventDefault();
    }

    //edit item click
    const itemEditClick = function (e) {
        
        if (e.target.classList.contains('edit-item')) {
            //get the list item id
            const listId = e.target.parentNode.parentNode.id;

            //const split
            const listIdArr = listId.split('-');

            const id = parseInt(listIdArr[1]);

            const itemToEdit = ItemCtrl.getItemById(id);

            console.log(itemToEdit);
            //set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            //add item to form
            UICtrl.addItemToForm();
        }
        
        e.preventDefault();
    }

    //Update item submit
    const itemUpdateSubmit = function (e) {
        //get item input
        const input = UICtrl.getItemInput();

        //update item
        const updateItem= ItemCtrl.updateItem(input.name, input.calories);

        //update UI
        UICtrl.updateListItem(updateItem);

         //get total calories
         const totalCalories = ItemCtrl.getTotalCalories();
         //add to UI
         UICtrl.showTotalCalories(totalCalories);

         //update LS
         StorageCtrl.updateItemStorage(updateItem);

         UICtrl.clearEditState();

        e.preventDefault();
    }

    //delete item
    const itemDeleteSubmit = function (e){
        //get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //delete item
        ItemCtrl.deleteItem(currentItem.id);

        //delete from UI
        UICtrl.deleteListItem(currentItem.id);

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //add to UI
        UICtrl.showTotalCalories(totalCalories);

        //delete from LS
        StorageCtrl.deleteItemFromLS(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    const clearAllItemsClick = function (e) {
        // delete all items from data structure
        ItemCtrl.clearAllItems();

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //add to UI
        UICtrl.showTotalCalories(totalCalories);

        //clear items from ui
        UICtrl.removeItems();

        // clear from LS
        StorageCtrl.clearItemsFromStorage();

        //Hide ul
        UICtrl.hideList();



    }

    //public methods
    return {
        init: function () {
            console.log('init app');

            //set initial state
            UICtrl.clearEditState();
            //fetch items from data structure
            const items = ItemCtrl.getItems();

            if (items.length === 0 ) {
                UICtrl.hideList();
            }else{
                //populate list with items
            UICtrl.populateItemList(items);
            }
            
            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //add to UI
            UICtrl.showTotalCalories(totalCalories);

            //Load event listeners
            loadEventListeners();
        }
    }
    //console.log(ItemCtrl.logData());
})(ItemCtrl, UICtrl, StorageCtrl);

App.init();