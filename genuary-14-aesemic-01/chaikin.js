// https://observablehq.com/@pamacha/chaikins-algorithm
function chaikin(arr, num) {
    if (num === 0) return arr;
    const l = arr.length;
    
    const smooth = arr.map((current, i) => {
        if (i < l - 1) {
            var x = 0;
            var y = 1;
            var next = arr[(i + 1)%l];
            return [
                [0.75*current[x] + 0.25*next[x], 0.75*current[y] + 0.25*next[y]],
                [0.25*current[x] + 0.75*next[x], 0.25*current[y] + 0.75*next[y]]
            ];
        } else {
            return [];
        }
    }).flat();
    return num === 1 ? smooth : chaikin(smooth, num - 1);
}