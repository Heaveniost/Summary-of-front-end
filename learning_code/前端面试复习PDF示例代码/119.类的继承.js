class Person {
    constructor(...props) {
        this.name = props.name;
        this.age = props.age;
    }
}

class Student extends Person {
    constructor(props) {
        super(props);
        this.score = props.score;
    }
}