const maxLen = 5;

export const generateid = ():string=>{
    const subset:string = "0123456789qwertyuiopasdfghjklzxcvbnm";
    let id:string = "";
    for(let i =0 ; i<maxLen ; i++){
        id+= subset.charAt(Math.floor(Math.random()*subset.length))
    }
    return id
}

