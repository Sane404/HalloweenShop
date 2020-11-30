let shopDiv = document.querySelector('.shop');
let flavor_confirm = document.querySelector('.flavor_confirm');
let flavors_selected = document.querySelector('.flavors');
let cart = document.querySelector('.cart');
let flavors_total_price = document.querySelector('.total');
let cart_total_amount = document.querySelector('.cart_total_amount');
let add_to_cart = document.querySelector('.add_to_cart');
let shopping_cart = document.querySelector('.shop_cart');
let shop_cart_total = document.querySelector('.shop_cart_total');
let back_to_shop = document.querySelector('.to_shop');
let ice_cream = document.querySelector('.ice_cream');
let ic = document.querySelectorAll('.ic');
let burger = document.querySelector('.burger');
let list = document.querySelector('.header_links');
let to_top = document.querySelector('.to_top');
shop_cart_total.addEventListener('click',Checkout);
burger.addEventListener('click',showNav);
add_to_cart.style.display = 'none';
back_to_shop.style.display = 'none';
ice_cream.style.display = 'none';
cart.addEventListener('click',showCart);
add_to_cart.addEventListener('click',AddtoCart);
window.onload = function(){
    getJsonData();
    setTimeout(Selector,1000);
}
window.onscroll = function(){
    if(window.pageYOffset >= 100){
        to_top.classList.add('visible');
    }else{
        to_top.classList.remove('visible');
    }
}

function getJsonData(){
    fetch('flavors.json').then(data => data.json()).then(data => data.forEach(flavor =>{
        let result = `<div class='flavor ${flavor.name}'>
                        <div class = 'bgimage' style="background-image:url('${flavor.url}')" data-color= ${flavor.color}></div>
                        <div class = 'name'>${flavor.name}</div>
                        <div class = 'price'>${flavor.price}$</div>
                     <button class = 'flavor_selector'>Select flavor</button>
                     </div>`;
        shopDiv.innerHTML += result;
    }))
}
function Selector(){
    let flavor_buttons = document.querySelectorAll('.flavor_selector');
    flavor_buttons.forEach(button=>button.addEventListener('click',FlavorSelected))
}
function FlavorSelected(e){
    if(flavors_selected.children.length == 3){
        alert('Too many flavors');
    }else{
    e.target.setAttribute('disabled',true);
    let flavor_name = e.target.parentNode.children[1].innerText;
    let flavor_price = e.target.parentNode.children[2].innerText.split('$')[0];
    let flavor_color = e.target.parentNode.children[0].dataset.color;
    let selected_flavor = `<div class='selected_flavor' data-price = ${flavor_price} data-color=${flavor_color}>
                            <p>${flavor_name}</p>
                            <button class = 'remove_flavor'>&#10006;</button>                      
                           </div>`
    flavors_selected.innerHTML += selected_flavor;
    }
    colorTheIceCream();
    UpdateTotal();
    
    let remover = document.querySelectorAll('.remove_flavor');
    remover.forEach(button => button.addEventListener('click',RemoveFlavor));
    if(flavors_selected.children.length !=0){
        add_to_cart.style.display = 'block';
        back_to_shop.style.display = 'block';
        flavors_total_price.style.display = 'block';
    }else{
        add_to_cart.style.display = 'none';
        back_to_shop.style.display = 'none';
    }
    flavors_selected.scrollIntoView({behavior:'smooth',block: 'center'});
}
function RemoveFlavor(e){
    // remove flavor from DOM 
    e.target.parentNode.remove();
    // reenable button in shop
    let f_name = e.target.parentNode.children[0].innerText.toLowerCase();
    for(i = 0 ; i<shopDiv.children.length;i++){
        if(shopDiv.children[i].classList.contains(f_name)){
            shopDiv.children[i].children[3].removeAttribute('disabled')
        }
    }
    colorTheIceCream();
    // remove total if no flavor selected
    if(flavors_selected.children.length == 0){
        add_to_cart.style.display = 'none';
        flavors_total_price.style.display = 'none';
        back_to_shop.style.display = 'none';
        ice_cream.style.display = 'none';
    }else{
        UpdateTotal();
    }
}
function UpdateTotal(){
    let total = 0;
    let selected_flavors = document.querySelectorAll('.selected_flavor');
    selected_flavors.forEach(item => total += +item.dataset.price);
    flavors_total_price.innerText = total.toFixed(2) + '$';
}
function AddtoCart(){
    let flavors = [];
    for(i = 0 ; i<flavors_selected.children.length;i++){
        flavors.push(flavors_selected.children[i].children[0].innerText)     
    }
    /*reset buttons*/
    let price = flavors_total_price.innerText.split('$')[0];
    addItemToCart(flavors,price)
    resetButtonsOnAddToCart();

}
function resetButtonsOnAddToCart(){
    let flavors_to_be_removed = document.querySelectorAll('.selected_flavor');
    flavors_to_be_removed.forEach(item=>item.remove());
    let flavor_select_buttons = document.querySelectorAll('.flavor_selector');
    flavor_select_buttons.forEach(item=>item.removeAttribute('disabled'));
    flavors_total_price.innerText = '';
    add_to_cart.style.display = 'none';
    back_to_shop.style.display = 'none';
}
function addItemToCart(array,price){
    let order = array.join('+');
    let shop_order = document.createElement('div');
    shop_order.classList.add('shop_order');
    let p = document.createElement('p');
    p.innerText = order + ' ice cream';
    let span1 = document.createElement('span');
    span1.classList.add('order_price');
    span1.innerText = price + '$';
    let span2 = document.createElement('span');
    span2.classList.add('less');
    span2.innerText = '-';
    let span3 = document.createElement('span');
    span3.classList.add('amount');
    span3.innerText = '1';
    let span4 = document.createElement('span');
    span4.classList.add('more');
    span4.innerText = '+';
    shop_order.append(p,span1,span2,span3,span4);
    shopping_cart.append(shop_order);
    // let result = `<div class ='shop_order'>
    //              <p>${order} ice cream</p>
    //              <span class = 'order_price'>${price} $</span>
    //              <span class='less'>-</span> 
    //              <span class='amount'>1</span>
    //              <span class='more'>+</span> 
    //              </div>`
    // shopping_cart.innerHTML += result;
    let more = document.querySelectorAll('.more');
    more.forEach(item=>item.addEventListener('click',addItem))
    let less = document.querySelectorAll('.less');
    less.forEach(item=>item.addEventListener('click',removeItem));
    updateCartTotal();
    updateCartTotalAmount();
    ice_cream.style.display = 'none';
}
function addItem(e){
    let amount = +e.target.previousElementSibling.innerText;
    amount += 1;
    e.target.previousElementSibling.innerText = amount;
    updateCartTotal();
    updateCartTotalAmount();
}
function removeItem(e){
    let amount = +e.target.nextElementSibling.innerText;
    amount -= 1;
    if(amount == 0){
        e.target.parentNode.remove();
    }else{
        e.target.nextElementSibling.innerText = amount;
    }
    updateCartTotal();
    updateCartTotalAmount();
}
function updateCartTotalAmount(){
    let shop_orders = document.querySelectorAll('.shop_order');
    let amount_total = 0;
    for(i=0;i<shop_orders.length;i++){
        let amount = shop_orders[i].children[3].innerText;
        amount_total += +amount;
    }
    cart_total_amount.innerText = amount_total;
}
function updateCartTotal(){
    let orders = document.querySelectorAll('.shop_order');
    let total = 0;
    for(i=0;i<orders.length;i++){
        let price = +orders[i].children[1].innerText.split('$')[0];
        let amount = +orders[i].children[3].innerText;
        total += price * amount;
    }
    let total_price = document.querySelector('.shop_cart_total');
    if(total == 0){
        total_price.innerText = "";
    }else{
        total_price.innerText = total.toFixed(2) + "$";
    }
}
function colorTheIceCream(){
    let flavors_to_color = document.querySelectorAll('.selected_flavor');
    ic.forEach(item=>item.style.fill = 'rgba(255,255,255,0)');
    ice_cream.style.display = 'block';
    for(i=0;i<flavors_to_color.length;i++){
        ic[i].style.fill = flavors_to_color[i].dataset.color;
    }
}
function showCart(){
    shopping_cart.classList.toggle('visible');
    if(list.classList.contains('mobile-visible')){
        list.classList.toggle('mobile-visible');
        animateBurger();
    }
}
function showNav(){
    list.classList.toggle('mobile-visible');
    if(shopping_cart.classList.contains('visible')){
        shopping_cart.classList.toggle('visible');
    }
    animateBurger();
}
function animateBurger(){
    let lines = document.querySelectorAll('.line');
    lines.forEach(item=>item.classList.toggle('rotated'));  
}


function Checkout(e){
    let orders = document.querySelectorAll('.shop_order');
    let ordersTitle = [];
    let ordersAmount = [];
    orders.forEach(item => {ordersTitle.push(item.children[0].innerText),ordersAmount.push(item.children[3].innerText)})
    let result = '';
    for(i=0;i<ordersAmount.length;i++){
       result += `${ordersTitle[i]} x ${ordersAmount[i]} \n`;
    }
    alert(`
    You order is:\n${result}
    
    Total price : ${e.target.innerText}
    `)
}