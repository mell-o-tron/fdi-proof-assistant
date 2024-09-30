# Specification

## Goals
The tool should allow the user to interact with a mathematical proof in a visual way. 

The user should interact with the proof by:

- Manipulating the hypothesis of the current goal
- Rewriting the goal using theorems and rules from a list
- Applying tactics to the goal


The proofs should regard:

- Structural Induction
- Relations

In the first iteration, we shall focus on structural induction. 

## Tool structure

The tool should provide:

- A home page
- A tutorial page
- A template page to be used for proofs, to be populated using JSON files

### Home Page
The home page should allow the user to choose a subject and start a proof. 

### Tutorial Page
The tutorial page should consist of a simple guided proof, that should effectively illustrate the usage of the interface.

### Proof Template
The proof template should be divided into two portions. On the left, a wider scrollable panel for the definitions and proof statement, and on the right a panel consisting of three accordions, each containing controls to interact with the proof in the three ways described above.

## Interaction with the proof
