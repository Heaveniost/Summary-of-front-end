//ES6
class Person{
    constructor(props){
        this.name = props.name
    }
    sayName(){
        console.log('My name is $(this.name)')
    }
}

class Student extends Person{
    constructor(props){
        super(props)
        this.name = props.name 
    }
}

var a = new Student('hurst')
console.log(a.name,a.sayName())