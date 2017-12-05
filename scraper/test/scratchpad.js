/*
 * This is a JavaScript Scratchpad.
 *
 * Enter some JavaScript, then Right Click or choose from the Execute Menu:
 * 1. Run to evaluate the selected text (Ctrl+R),
 * 2. Inspect to bring up an Object Inspector on the result (Ctrl+I), or,
 * 3. Display to insert the result in a comment after the selection. (Ctrl+L)
 */


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
  var $ = jQuery;
  $('.ProductDetail-select-category').click();
  
  await sleep(500);
  $('.js-modal-close').click();
  
}

var test = 123,
    someVar = 812;

function searchObject(object, search){
    for(key in object){
        if(typeof object[key] === 'number' || typeof object[key] === 'string'){
            if(object[key] === search){
                console.log(key ,window[key]);
            }
        }else if(typeof object[key] === 'object'){
            searchObject(object[key], search);
        }
    }
};


searchObject(window.wf, ' +$2.00');


//demo();
