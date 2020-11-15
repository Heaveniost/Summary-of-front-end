function throttle(fn,wait) {
    var pre = Date.now()
    return function() {
        var context = this 
        var args = arguments 
        var now = Date.now()
        if(now - pre >= wait) {
            fn.apply(context.args)
            pre = Date.now()
        }
    }
}

function handle() {
    console.log(Math.random())
}

window.addEventListener("mousemove", throttle(handle,1000))