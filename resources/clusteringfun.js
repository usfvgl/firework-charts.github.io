
let points = [
    [0,0],
    [0.1,0.1],
    [0.2,0.2],
    [2.0,2.0],
    [2.1,2.1],
    [2.2,2.3]
];
let c = ["blue", "red", "green"]

let used = 0;

// Thanks internet
export function zip(arrays) {
    return arrays[0].map(function(_,i){
        return arrays.map(function(array){return array[i]})
    });
}

export function pickColors(points, colors) {
    // Calculate clusters.
    let clusters = clusterfck.hcluster(points, clusterfck.EUCLIDEAN_DISTANCE, clusterfck.AVERAGE_LINKAGE);

    // Pick colors based on that
    return evelyns(clusters, colors, new Map());
}

// Thanks internet
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function randomColors(n, colors) {
    let out = shuffle(colors).slice(0,n);
    console.log(out);
    return out;
}

// Return an array of this node's children in order
function nodeTraverse(node) {
    let out = [];

    if (node.hasOwnProperty("value")) {
        out.push(node.value);
    } else {
        out = out.concat(nodeTraverse(node.left));
        out = out.concat(nodeTraverse(node.right));
    }

    return out;
}

function stringify(arr) {
    let out = "";
    for (let value of arr) {
        out = out + value.toString() + " ";
    }
    return out;
}

function evelyns(node, colors, output) {
    let n = colors.length
    if (node.size <= n) {
        let newColors = randomColors(node.size, colors)
        let values = nodeTraverse(node);
        for (let i = 0; i<values.length; i++) {
            let key = stringify(values[i]);
            output[key]= newColors[i];
        }
    } else {
        evelyns(node.left, colors, output);
        evelyns(node.right, colors, output);
    }
    return output
}

// console.log(pickColors(points, c));