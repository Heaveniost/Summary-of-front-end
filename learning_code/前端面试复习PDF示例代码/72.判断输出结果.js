function changeObjectProperty(o){ 
    // 输出的是这个结果 
    o.siteUrl = "http://www.csser.com/"
    o = new Object(); 
    o.siteUrl = "http://www.popcg.com/"; 
}

var CSSer = new Object(); 
changeObjectProperty( CSSer ); 
console.log( CSSer.siteUrl ); // http://www.csser.com/