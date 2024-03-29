# Project #3: Bust the Ghost Game

## Overview

In this assignment, you are tasked with implementing the "Bust the Ghost" game, which requires the following features:

- A grid of size 9x12.
- Two buttons: "Bust the Ghost" for attempting to capture the ghost and "Peep" for revealing probabilities.
- A toggle function for the "Peep" button that displays the probability of the ghost's presence on each square when activated.
- Display of remaining "bust" attempts and the player's score at all times.
- Placement of the ghost in one of the cells based on a uniform prior distribution over locations.

## Gameplay

- Players interact with the grid by clicking on cells to perform sensor readings, receiving a color indicator (red, orange, yellow, green) that signifies the distance from the ghost.
    - **Red**: On the ghost.
    - **Orange**: 1 or 2 cells away.
    - **Yellow**: 3 or 4 cells away.
    - **Green**: 5 or more cells away.
- Each click reduces the player's score by 1 point from an initial credit. The game ends when the player runs out of credit.
- Players can "bust" a cell to attempt capturing the ghost. Winning occurs if the ghost is in the targeted cell, while running out of "bust" attempts (initially set to 2) results in a loss.

## Technical Details

1. **Ghost Location (G)**: Define a random variable `G` for the ghost's location with a domain of {(1,1), (1,2), ..., (9,12)}.
2. **Sensor Reading (S)**: Define a variable `S` for sensor readings with a domain {Red, Green, Yellow, Orange}.
3. **Conditional Probability Distributions**: Use `P(Color/Distance from Ghost)` to reflect the sensor's sensitivity and decide on the color to display.

### Bayesian Inference

After each click at location `Li`, update the Posterior Probability `Pt(G=Li)` using Bayesian inference:

Pt(G=Li) = Pt(G=Li | S=Color at location Li) = P(S=Color at location Li | G=Li) * Pt-1(G=Lj)


- **Initial Prior Probability (`P0(G=Lj)`)**: A uniform distribution.
- Normalize probabilities of all locations after each update.

### Bonus: Direction Sensor

In addition to the distance sensor, incorporate a direction sensor that provides the direction of the ghost. This requires:

- Conditional distributions for the direction sensor.
- Updated formulas for posterior probabilities, considering evidence from both sensors.
- GUI updates to support the two sensors and demonstrate their functionality.

## Functions/Structures

- `PlaceGhost()`: Returns `xg`, `yg`.
- `ComputeInitialPriorProbabilities(locations)`.
- Separate conditional distribution tables for colors per distance.
- `DistanceSense(xclk, yclk, dist, gx, gy)`: Returns a color based on the clicked position's distance from the ghost and the conditional probability tables.
- `UpdatePosteriorGhostLocationProbabilities(Color: c, xclk, yclk)`: Updates the probabilities for each location based on the sensed color.

## Deliverables

- A working demo posted on YouTube.
- A report focusing on probabilistic inferencing, including a Table of Contents (TOC) and a table showing the division of tasks among team members.
