pragma circom 2.0.0;

// [assignment] Modify the circuit below to perform a multiplication of three signals

// Include the Multiplier2 template to build off of
// include "HelloWorld.circom";
template Multiplier2 () {
   signal input a;
   signal input b;
   signal output c;
   c <== a * b;
}

template Multiplier3 () {
   // Declaration of signals.
   signal input a;
   signal input b;
   signal input c;
   signal output d;

   // Use Multiplier2 to construct constraints for multiplying three numbers together
   component mult1 = Multiplier2();
   component mult2 = Multiplier2();
   // Get output for a*b
   mult1.a <== a;
   mult1.b <== b;
   mult2.a <== mult1.c;
   // Get output for (a*b)*c
   mult2.b <== c;
   // Assign as template output
   d <== mult2.c;
}

component main = Multiplier3();