function debounce(func, wait) {
    return function() {
        
        setTimeout(func, wait)
    }
}