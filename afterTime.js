// Factory pattern in Javascript;

function Set(){
    const allWays = [];

    const contains = (element) => {
        return allWays.some(way =>
            JSON.stringify(way) === JSON.stringify(element)
        )
    }

    const add = (element) => {
        if (contains(element)) return false;
        allWays.push(element);
        allWays.sort();
        return true;
    }

    const addAll = (set) => {
        let atLeastOneAdded = false;
        set.forEach(element => {
            atLeastOneAdded = atLeastOneAdded ? true : add(element);
        })
        return atLeastOneAdded;
    }

    const equals = (set) => {
        return JSON.stringify(set) === JSON.stringify(allWays)
    }

    const iterator = ()=> {
        return allWays;
    }

    const remove = (element) => {
        const index = allWays.findIndex(a => 
            JSON.stringify(a) === JSON.stringify(element)
        )
        if (index !== -1) allWays.splice(1, 1)
    }

    const toArray = () => allWays

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
    const allWays = [];

    function sweet(set, value, coins){
        if (coins.length <= 1){
            const newSet = [...set]
            newSet[3] += value;
            allWays.push(newSet);
            return
        }

        for(let i = 0; i <= coins.length; i++){
            const newSet = [...set];
            let num = value;
            if(coins[i] === coins[0] && num >= coins[0]){
                const index  = coins[0] === 25 ? 0 : coins[0] === 10 ? 1 : coins[0] === 5 ? 2 : 3;
                newSet[index] += 1;
                num -= coins[0]
                sweet(newSet, num, coins.slice(i))
                called = true;
            }else if (num >= coins[i] && coins[i] !== coins[0]){
                sweet(newSet, num, coins.slice(i))
                break;
            }
        } 
    }
    sweet([0,0,0,0], value, allCoins)
    return allWays;
}

console.log(makeChange(12));

