// credits: chatgpt
// Function to rotate a 2d array clockwise
export function rotateArray<T>(arr: T[][]) {
  // Get the number of rows and columns in the array
  const rows = arr.length;
  const cols = Math.max(...arr.map((x) => x.length));

  // Create a new 2d array to store the rotated version
  const rotatedArr: T[][] = [];
  for (let i = 0; i < cols; i++) {
    rotatedArr.push([]);
  }

  // Loop through the original array and add each element to the rotated array
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      rotatedArr[cols - j - 1][i] = arr[i][j];
    }
  }

  return rotatedArr;
}
