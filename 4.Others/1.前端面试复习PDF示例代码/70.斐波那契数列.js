function Fibo(n){
    if(n==1) return 0;
    if(n==2) return 1;
    return Fibo(n-1) + Fibo(n-2)
}

console.log(Fibo(10))