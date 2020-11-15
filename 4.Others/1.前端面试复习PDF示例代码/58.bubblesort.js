function sortBubble(arr) {
    for(var i=0; i<arr.length; i++) {
        for(var j=0; j<arr.length-i; j++) {
            if(arr[j] > arr[j+1]) {
                var temp = arr[j]
                arr[j] = arr[j+1]
                arr[j+1] = temp
            }
        }
    }
    return arr 
}


// function sortBubble(arr) { 
//     for (var i = 0; i < arr.length; i++) { 
//         for (var j = 0; j < arr.length - i; j++) { 
//             if (arr[j] > arr[j + 1]) { 
//                 var temp = arr[j]; 
//                 arr[j] = arr[j + 1]; 
//                 arr[j + 1] = temp; 
//             } 
//         }
//     }
//     return arr 
// }

var arr = [2,4,1,2,56,7,9]
console.log(sortBubble(arr))
