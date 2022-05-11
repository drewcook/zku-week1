const { expect } = require('chai')
const { ethers } = require('hardhat')
const { groth16 } = require('snarkjs')
const fs = require('fs')

function unstringifyBigInts(o) {
	if (typeof o == 'string' && /^[0-9]+$/.test(o)) {
		return BigInt(o)
	} else if (typeof o == 'string' && /^0x[0-9a-fA-F]+$/.test(o)) {
		return BigInt(o)
	} else if (Array.isArray(o)) {
		return o.map(unstringifyBigInts)
	} else if (typeof o == 'object') {
		if (o === null) return null
		const res = {}
		const keys = Object.keys(o)
		keys.forEach(k => {
			res[k] = unstringifyBigInts(o[k])
		})
		return res
	} else {
		return o
	}
}

describe('LessThan10', function () {
	let Verifier
	let verifier

	beforeEach(async function () {
		Verifier = await ethers.getContractFactory('LessThan10Verifier')
		verifier = await Verifier.deploy()
		await verifier.deployed()
	})

	it('Should return true for correct proof', async function () {
		//[assignment] Add comments to explain what each line is doing

		// Here we are running the equivalent of `snarkjs groth16 fullprove` with a Nodejs module instead. We are storing both the proof and the public signals used in the circuit as variables for later testing. We create a proof with signal values of 1 and 2.
		const { proof, publicSignals } = await groth16.fullProve(
			{ a: 3 },
			'contracts/circuits/LessThan10/LessThan10_js/LessThan10.wasm',
			'contracts/circuits/LessThan10/circuit_final.zkey',
		)

		// Ensuring we have access to the public signal output, which in this case is 2
		console.log({ proof, publicSignals })

		// Convert big number strings into native big number datatypes
		// const editedPublicSignals = unstringifyBigInts(publicSignals)
		// const editedProof = unstringifyBigInts(proof)

		// // Grab the calldata from the smart contract representing the verifier with this handy utility function
		// const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals)

		// // Transform the calldata into a flat array of strings so they're easier to work with
		// const argv = calldata
		// 	.replace(/["[\]\s]/g, '')
		// 	.split(',')
		// 	.map(x => BigInt(x).toString())

		// // Assign values to plug in for verifying the proof
		// const a = [argv[0], argv[1]]
		// const b = [
		// 	[argv[2], argv[3]],
		// 	[argv[4], argv[5]],
		// ]
		// const c = [argv[6], argv[7]]

		// // Assign the input, which will be the last value from calldata
		// const Input = argv.slice(8)

		// // Now we use the verifier smart contract to verify the proof from the given input and output
		// expect(await verifier.verifyProof(a, b, c, Input)).to.be.true
	})

	it('Should return false for invalid proof', async function () {
		let a = [0, 0]
		let b = [
			[0, 0],
			[0, 0],
		]
		let c = [0, 0]
		let d = [0]
		expect(await verifier.verifyProof(a, b, c, d)).to.be.false
	})
})
