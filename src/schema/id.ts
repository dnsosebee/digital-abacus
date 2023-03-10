import { customAlphabet } from "nanoid";
export const ALPHABET = "346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz";

export const genId = (idLength: number) => () => {
  return customAlphabet(ALPHABET, idLength)();
};

// rotates through nanoid uuids to prevent collisions
// might overflow if given a long ID, intending to only use for flow and dart IDs
// export const nextId = (id: string) => {
//   const num = idToNumber(id);
//   const nextNum = (num + 1) % Math.pow(ALPHABET.length, id.length);
//   return numberToId(nextNum);
// };

// const idToNumber = (id: string): number => {
//   let sum = 0;
//   for (let i = 0; i < id.length; i++) {
//     const char = id[i];
//     const index = ALPHABET.indexOf(char);
//     sum += index * Math.pow(ALPHABET.length, id.length - i - 1);
//   }
//   return sum;
// };

// const numberToId = (num: number): string => {
//   let id = "";
//   while (num > 0) {
//     const index = num % ALPHABET.length;
//     id = ALPHABET[index] + id;
//     num = Math.floor(num / ALPHABET.length);
//   }
//   return id;
// };
