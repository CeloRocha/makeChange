// Using factory pattern in Javascript for Element and Set class.

function Element (quart = 0, dim = 0, nick = 0, penni = 0) {
    let quarters = quart;
    let dimes = dim;
    let nickels = nick;
    let pennies = penni;
    
    const get = () => ([quarters, dimes, nickels, pennies])
    
    const set = (quart = 0, dim = 0, nick = 0, penni = 0) => {
        quarters = quart;
        dimes = dim;
        nickels = nick;
        pennies = penni;
        return true;
    }

    const setWithArray = ([q, d, n, p]) => {
        quarters = q;
        dimes = d;
        nickels = n;
        pennies = p;
        return true;
    }
    
    const totalCoins = () => quarters*25 + dimes*10 + nickels*5 + pennies*1;

    const addCoins = (value) => {
        if(value < 0) return false;
        let actualValue = value;
        while(actualValue >= 25){
            quarters += 1;
            actualValue -= 25;
        }
        while(actualValue >= 10){
            dimes += 1;
            actualValue -= 10;
        }
        while(actualValue >= 5){
            nickels += 1;
            actualValue -= 5;
        }
        pennies += actualValue;
    
        return true
    }

    const removeCoins = (value) => {
        const actualValue = totalCoins();
        if (actualValue >= value){
            actualValue -= value;
            set();
            addCoins(actualValue);
            return true;
        }
        return false;
    }


    return { get, set, setWithArray, totalCoins, addCoins, removeCoins}
}

function Set(){
    const allWays = [];

    // Test not the exact Element, but its coins;
    const contains = (element) => {
        return allWays.some(way =>
            JSON.stringify(way.get()) === JSON.stringify(element.get())
        )
    }

    const add = (element) => {
        if (contains(element)) return false;
        allWays.push(element);
        allWays.sort((a,b) => JSON.stringify(b.get()).localeCompare(JSON.stringify(a.get())));
        return true;
    }

    const addAll = (set) => {
        let atLeastOneAdded = false;
        set.iterator().forEach(element => {
            const value = add(element)
            atLeastOneAdded = atLeastOneAdded ? true : value;
        })
        return atLeastOneAdded;
    }

    const equals = (set) => {
        try{
            return set.iterator().every((a, index) => JSON.stringify(a.get()) === JSON.stringify(allWays[index].get()))
        }catch{
            return false;
        }
    }

    const iterator = ()=> {
        return allWays;
    }

    const remove = (element) => {
        const index = allWays.findIndex(a => 
            JSON.stringify(a.get()) === JSON.stringify(element.get())
        )
        if (index !== -1) allWays.splice(index, 1)
    }

    const toArray = () => allWays.map(element => element.get())

    const size = () => allWays.length
    
    return {
        add,
        addAll,
        contains,
        equals,
        iterator,
        remove,
        size,
        toArray
    }
}

// Input in cents;
// Return all possible changes in coins for the input.
// EX: in = 12, output = [[0,0,0,12], [0,0,1,7], [0,0,2,2], [0,1,0,2]]
// Recursive function

// - The function sets all the coins to use;
// - Initialize the array with all ways to return;
// - Uses greedy algorithm recursively to define the coin to pick;
// - Pushes the final set to the array to return;

// The greedy algorithm acceps, the actual set, the actual value, and the coins to use;
// Pick the bigger one and put in the set if possible, calling it again with the new set;
// And calls it again with a minor pool of coins.
function makeChange(value){
    const allCoins = [25, 10, 5, 1]
    const set = Set();
    const element = Element();

    function sweet(element, value, coins){
        if (coins.length <= 1 || value === 0){ // Conditions to return correct when value is 0
            // Adding the final coins
            const arr = [...element.get()]
            arr[3] += value
            const newelement = Element()
            newelement.setWithArray(arr)
            set.add(newelement);
            return
        }

        for(let i = 0; i <= coins.length; i++){
            const newelement = Element()
            newelement.setWithArray(element.get())
            let num = value;
            if(coins[i] === coins[0] && num >= coins[0]){
                newelement.addCoins(coins[0])
                num -= coins[0]
                sweet(newelement, num, coins.slice(i))
            }else if (num >= coins[i] && coins[i] !== coins[0]){
                sweet(newelement, num, coins.slice(i))
                break; // Just create recursively the next coins without the bigger one in this call.
            }
        } 
    }
    sweet(element, value, allCoins)
    return set;
}


// Section to use tests

const set12 = makeChange(12);
const set7 = makeChange(7);

console.log('Set 12', set12.toArray())
console.log('Set 7', set7.toArray())

set12.addAll(set7)
console.log(set12.toArray())

const element = Element(2, 5, 8, 9);

console.log('Contains new element: ', set12.contains(element));

set12.add(element)
console.log('Add element: ', set12.toArray())

console.log('Contains new element: ', set12.contains(element));

set12.remove(element)
console.log('Remove element: ', set12.toArray())

console.log('Contains new element: ', set12.contains(element));

const set7again = makeChange(7);
console.log('12 equals 7: ', set12.equals(set7));
console.log('7 equals 7: ', set7.equals(set7again));

console.log('Size of 7: ', set7.size())