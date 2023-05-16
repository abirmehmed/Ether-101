
// 1. BigNumber
console.group('\n1. BigNumber class');

const oneGwei = ethers.getBigInt("1000000000"); // create a BigNumber from a decimal string
console.log(oneGwei)
console.log(ethers.getBigInt("0x3b9aca00")) // create a BigNumber from a hex string
console.log(ethers.getBigInt(1000000000)) // create a BigNumber from a number
// cannot create a BigNumber from a number that is outside of the maximum safe integer in JavaScript, the following code will throw an error
// ethers.getBigInt(Number.MAX_SAFE_INTEGER);
console.log("the maximum safe integer in JavaScript:", Number.MAX_SAFE_INTEGER)

// arithmetic
console.log("addition:", oneGwei + 1n)
console.log("subtraction:", oneGwei - 1n)
console.log("multiplication:", oneGwei * 2n)
console.log("division:", oneGwei / 2n)
// comparison
console.log("equality:", oneGwei == 1000000000n)


// 2. Formatting: convert smaller units to larger units
// For example, convert wei to ether: formatUnits(value, unit): unit can be a number of digits or a specific unit name
console.group('\n2. Formatting: convert smaller units to larger units, formatUnits');
console.log(ethers.formatUnits(oneGwei, 0));
// '1000000000'
console.log(ethers.formatUnits(oneGwei, "gwei"));
// '1.0'
console.log(ethers.formatUnits(oneGwei, 9));
// '1.0'
console.log(ethers.formatUnits(oneGwei, "ether"));
// `0.000000001`
console.log(ethers.formatUnits(1000000000, "gwei"));
// '1.0'
console.log(ethers.formatEther(oneGwei));
// `0.000000001` equivalent to formatUnits(value, "ether")
console.groupEnd();


// 3. Parsing: convert larger units to smaller units
// For example, convert ether to wei: parseUnits(value, unit), parseUnits defaults to ether as the unit
console.group('\n3. Parsing: convert larger units to smaller units, parseUnits');
console.log(ethers.parseUnits("1.0").toString());
// { BigNumber: "1000000000000000000" }
console.log(ethers.parseUnits("1.0", "ether").toString());
// { BigNumber: "1000000000000000000" }
console.log(ethers.parseUnits("1.0", 18).toString());
// { BigNumber: "1000000000000000000" }
console.log(ethers.parseUnits("1.0", "gwei").toString());
// { BigNumber: "1000000000" }
console.log(ethers.parseUnits("1.0", 9).toString());
// { BigNumber: "1000000000" }
console.log(ethers.parseEther("1.0").toString());
// { BigNumber: "1000000000000000000" } equivalent to parseUnits(value, "ether")
console.groupEnd();
