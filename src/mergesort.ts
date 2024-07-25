export function mergeSort(arr: number[], states: { type: 'node' | 'merged', value: number[], depth: number}[], depth: number = 0): number[] {
    // Record the initial state of the array
    states.push({ type: "node", value: arr.slice(), depth: depth});
    
    if (arr.length <= 1) {
        return arr;
    }

    const mid: number = Math.floor(arr.length / 2);
    const left: number[] = mergeSort(arr.slice(0, mid), states, depth + 1);
    const right: number[] = mergeSort(arr.slice(mid), states, depth + 1);

    const merged: number[] = merge(left, right);
    states.push({ type: "merged", value: merged.slice(), depth: (depth + 1) * -1});  // Record the state after merging
    return merged;
}

export function merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let leftIndex: number = 0;
    let rightIndex: number = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

