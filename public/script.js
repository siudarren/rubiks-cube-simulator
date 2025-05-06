import {randomScrambleForEvent} from "https://cdn.cubing.net/js/cubing/scramble";

// Start the webpage after the content is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Set rotation steps and speed
    let rotateSteps = 32;
    let stepInterval = 20;

    let algorithms;
    // Find sideLength
    let computedStyle;
    let sideLength;

    // Set the quaternion of the entire cube.
    let cubeQuaternion = new Quaternion(1, 0, 0, 0); // Identity quaternion, no rotation

    // Initialize boolean, turning. Will not turn the cube if the turning === true.
    let turning = false;
    // Initialize boolean, isDragging. Will start turning the cube if isDragging.
    let isDragging = false;
    let stop = false;
    let solvingOrScrambling = false;
    let slideOrDrag = "drag";

    // The x coordinate and y coordinate of the page when you start dragging.
    let startX, startY;

    let xRotate;
    let yRotate;
    let zRotate;

    let blocks;
    // Creating a array of quaternions, one for each block
    let move = new Array(27).fill(0);

    let lastMove = "solveOrScramble";

    let scrambleString = "";

    // Function to initiate and control the cube rotation process based on a rotation string.
    function rotate(rotationString) {
        if (turning) {
            return;
        }
        const steps = rotateSteps;
        const interval = stepInterval;
        let index = 0; // Index to track the current letter in the rotationString
        turning = true; // Indicate that processing has started
        executeRotation(); // Start the rotation process

        function executeRotation() {
            if (stop) {
                resetCube();
                return;
            }
            if (index >= rotationString.length) {
                turning = false; // No more rotations, stop processing
                if (solvingOrScrambling) {
                    solvingOrScrambling = false;
                    moveHistoryLog.innerHTML += " )<br><br>";
                    lastMove = "solveOrScramble";
                }
                return; // Exit the function
            }

            const rotationLetter = rotationString[index];
            updateMoveLog(rotationLetter);
            let count = 0; // Counter for the current letter rotation execution
            let maxCount = Math.floor(steps / 2); // Total executions required

            // Function to perform the rotation
            function performRotation() {
                switch (rotationLetter) {
                    case "d":
                        rotateD(steps);
                        break;
                    case "D":
                        rotateDPrime(steps);
                        break;
                    case "u":
                        rotateU(steps);
                        break;
                    case "U":
                        rotateUPrime(steps);
                        break;
                    case "r":
                        rotateR(steps);
                        break;
                    case "R":
                        rotateRPrime(steps);
                        break;
                    case "f":
                        rotateF(steps);
                        break;
                    case "F":
                        rotateFPrime(steps);
                        break;
                    case "l":
                        rotateL(steps);
                        break;
                    case "L":
                        rotateLPrime(steps);
                        break;
                    case "b":
                        rotateB(steps);
                        break;
                    case "B":
                        rotateBPrime(steps);
                        break;
                    case "m":
                        rotateM(steps);
                        break;
                    case "M":
                        rotateMPrime(steps);
                        break;
                    case "x":
                        rotateX(steps);
                        break;
                    case "X":
                        rotateXPrime(steps);
                        break;
                    case "y":
                        rotateY(steps);
                        break;
                    case "Y":
                        rotateYPrime(steps);
                        break;
                    case "z":
                        rotateZ(steps);
                        break;
                    case "Z":
                        rotateZPrime(steps);
                        break;
                    case "s":
                        rotateS(steps);
                        break;
                    case "S":
                        rotateSPrime(steps);
                        break;
                    case "e":
                        rotateE(steps);
                        break;
                    case "E":
                        rotateEPrime(steps);
                        break;
                    case "q":
                        rotateRw(steps);
                        break;
                    case "Q":
                        rotateRwPrime(steps);
                        break;
                    case "t":
                        rotateLw(steps);
                        break;
                    case "T":
                        rotateLwPrime(steps);
                        break;
                    case "o":
                        rotateFw(steps);
                        break;
                    case "O":
                        rotateFwPrime(steps);
                        break;
                    case "p":
                        rotateUw(steps);
                        break;
                    case "P":
                        rotateUwPrime(steps);
                        break;
                    default:
                        console.error("Invalid rotation letter:", rotationLetter);
                        turning = false;
                        return; // Stop execution on error
                }

                count++;
                if (count < maxCount) {
                    setTimeout(performRotation, interval); // Schedule the next rotation
                } else {
                    updatePositions(rotationLetter); // Update positions after finishing the rotations
                    index++; // Move to the next letter
                    setTimeout(executeRotation, 0); // Handle the next letter
                }
            }
            performRotation(); // Start rotations for the current letter
        }

        // Function to update block positions after each rotation
        function updatePositions(lastRotation) {
            switch (lastRotation) {
                case "d":
                    setBlocksPositionD();
                    break;
                case "D":
                    setBlocksPositionDPrime();
                    break;
                case "r":
                    setBlocksPositionR();
                    break;
                case "R":
                    setBlocksPositionRPrime();
                    break;
                case "u":
                    setBlocksPositionU();
                    break;
                case "U":
                    setBlocksPositionUPrime();
                    break;
                case "f":
                    setBlocksPositionF();
                    break;
                case "F":
                    setBlocksPositionFPrime();
                    break;
                case "l":
                    setBlocksPositionL();
                    break;
                case "L":
                    setBlocksPositionLPrime();
                    break;
                case "b":
                    setBlocksPositionB();
                    break;
                case "B":
                    setBlocksPositionBPrime();
                    break;
                case "m":
                    setBlocksPositionM();
                    break;
                case "M":
                    setBlocksPositionMPrime();
                    break;
                case "x":
                    setBlocksPositionX();
                    break;
                case "X":
                    setBlocksPositionXPrime();
                    break;
                case "y":
                    setBlocksPositionY();
                    break;
                case "Y":
                    setBlocksPositionYPrime();
                    break;
                case "z":
                    setBlocksPositionZ();
                    break;
                case "Z":
                    setBlocksPositionZPrime();
                    break;
                case "s":
                    setBlocksPositionS();
                    break;
                case "S":
                    setBlocksPositionSPrime();
                    break;
                case "e":
                    setBlocksPositionE();
                    break;
                case "E":
                    setBlocksPositionEPrime();
                    break;
                case "q":
                    setBlocksPositionRw();
                    break;
                case "Q":
                    setBlocksPositionRwPrime();
                    break;
                case "t":
                    setBlocksPositionLw();
                    break;
                case "T":
                    setBlocksPositionLwPrime();
                    break;
                case "o":
                    setBlocksPositionFw();
                    break;
                case "O":
                    setBlocksPositionFwPrime();
                    break;
                case "p":
                    setBlocksPositionUw();
                    break;
                case "P":
                    setBlocksPositionUwPrime();
                    break;
            }
        }

        function rotateFw(steps) {
            rotateF(steps);
            rotateS(steps);
        }

        function rotateFwPrime(steps) {
            rotateFPrime(steps);
            rotateSPrime(steps);
        }

        function rotateUw(steps) {
            rotateU(steps);
            rotateEPrime(steps);
        }

        function rotateUwPrime(steps) {
            rotateUPrime(steps);
            rotateE(steps);
        }

        function rotateLw(steps) {
            rotateL(steps);
            rotateM(steps);
        }

        function rotateLwPrime(steps) {
            rotateLPrime(steps);
            rotateMPrime(steps);
        }

        function rotateRw(steps) {
            rotateR(steps);
            rotateMPrime(steps);
        }

        function rotateRwPrime(steps) {
            rotateRPrime(steps);
            rotateM(steps);
        }

        function rotateD(steps) {
            for (let i = 0; i < 9; i++) {
                const blockNum = locateBlock(blocks[i]);
                move[blockNum] = move[blockNum].mul(Quaternion.fromAxisAngle([0, -1, 0], Math.PI / steps));
                let matrix = move[blockNum].toMatrix4();
                blocks[i].style.transform = `matrix3d(${matrix.join(",")})`;
            }
        }

        function rotateDPrime(steps) {
            for (let i = 0; i < 9; i++) {
                const blockNum = locateBlock(blocks[i]);
                move[blockNum] = move[blockNum].mul(Quaternion.fromAxisAngle([0, 1, 0], Math.PI / steps));
                let matrix = move[blockNum].toMatrix4();
                blocks[i].style.transform = `matrix3d(${matrix.join(",")})`;
            }
        }

        function rotateE(steps) {
            for (let i = 9; i < 18; i++) {
                const blockNum = locateBlock(blocks[i]);
                move[blockNum] = move[blockNum].mul(Quaternion.fromAxisAngle([0, -1, 0], Math.PI / steps));
                let matrix = move[blockNum].toMatrix4();
                blocks[i].style.transform = `matrix3d(${matrix.join(",")})`;
            }
        }

        function rotateEPrime(steps) {
            for (let i = 9; i < 18; i++) {
                const blockNum = locateBlock(blocks[i]);
                move[blockNum] = move[blockNum].mul(Quaternion.fromAxisAngle([0, 1, 0], Math.PI / steps));
                let matrix = move[blockNum].toMatrix4();
                blocks[i].style.transform = `matrix3d(${matrix.join(",")})`;
            }
        }

        function rotateU(steps) {
            for (let i = 18; i < 27; i++) {
                const blockNum = locateBlock(blocks[i]);
                move[blockNum] = move[blockNum].mul(Quaternion.fromAxisAngle([0, 1, 0], Math.PI / steps));
                let matrix = move[blockNum].toMatrix4();
                blocks[i].style.transform = `matrix3d(${matrix.join(",")})`;
            }
        }
        function rotateUPrime(steps) {
            for (let i = 18; i < 27; i++) {
                const blockNum = locateBlock(blocks[i]);
                move[blockNum] = move[blockNum].mul(Quaternion.fromAxisAngle([0, -1, 0], Math.PI / steps));
                let matrix = move[blockNum].toMatrix4();
                blocks[i].style.transform = `matrix3d(${matrix.join(",")})`;
            }
        }

        function rotateR(steps) {
            for (let i = 2; i < 27; i += 3) {
                const blockNum = locateBlock(blocks[i]);
                move[blockNum] = move[blockNum].mul(Quaternion.fromAxisAngle([-1, 0, 0], Math.PI / steps));
                let matrix = move[blockNum].toMatrix4();
                blocks[i].style.transform = `matrix3d(${matrix.join(",")})`;
            }
        }

        function rotateRPrime(steps) {
            for (let i = 2; i < 27; i += 3) {
                const blockNum = locateBlock(blocks[i]);
                move[blockNum] = move[blockNum].mul(Quaternion.fromAxisAngle([1, 0, 0], Math.PI / steps));
                let matrix = move[blockNum].toMatrix4();
                blocks[i].style.transform = `matrix3d(${matrix.join(",")})`;
            }
        }

        function rotateM(steps) {
            for (let i = 1; i < 27; i += 3) {
                const blockNum = locateBlock(blocks[i]);
                move[blockNum] = move[blockNum].mul(Quaternion.fromAxisAngle([1, 0, 0], Math.PI / steps));
                let matrix = move[blockNum].toMatrix4();
                blocks[i].style.transform = `matrix3d(${matrix.join(",")})`;
            }
        }

        function rotateMPrime(steps) {
            for (let i = 1; i < 27; i += 3) {
                const blockNum = locateBlock(blocks[i]);
                move[blockNum] = move[blockNum].mul(Quaternion.fromAxisAngle([-1, 0, 0], Math.PI / steps));
                let matrix = move[blockNum].toMatrix4();
                blocks[i].style.transform = `matrix3d(${matrix.join(",")})`;
            }
        }

        function rotateL(steps) {
            for (let i = 0; i < 27; i += 3) {
                const blockNum = locateBlock(blocks[i]);
                move[blockNum] = move[blockNum].mul(Quaternion.fromAxisAngle([1, 0, 0], Math.PI / steps));
                let matrix = move[blockNum].toMatrix4();
                blocks[i].style.transform = `matrix3d(${matrix.join(",")})`;
            }
        }

        function rotateLPrime(steps) {
            for (let i = 0; i < 27; i += 3) {
                const blockNum = locateBlock(blocks[i]);
                move[blockNum] = move[blockNum].mul(Quaternion.fromAxisAngle([-1, 0, 0], Math.PI / steps));
                let matrix = move[blockNum].toMatrix4();
                blocks[i].style.transform = `matrix3d(${matrix.join(",")})`;
            }
        }

        function rotateF(steps) {
            for (let i = 0; i < 27; i += 9) {
                for (let j = i; j < i + 3; j++) {
                    const blockNum = locateBlock(blocks[j]);
                    move[blockNum] = move[blockNum].mul(Quaternion.fromAxisAngle([0, 0, -1], Math.PI / steps));
                    let matrix = move[blockNum].toMatrix4();
                    blocks[j].style.transform = `matrix3d(${matrix.join(",")})`;
                }
            }
        }

        function rotateFPrime(steps) {
            for (let i = 0; i < 27; i += 9) {
                for (let j = i; j < i + 3; j++) {
                    const blockNum = locateBlock(blocks[j]);
                    move[blockNum] = move[blockNum].mul(Quaternion.fromAxisAngle([0, 0, 1], Math.PI / steps));
                    let matrix = move[blockNum].toMatrix4();
                    blocks[j].style.transform = `matrix3d(${matrix.join(",")})`;
                }
            }
        }

        function rotateS(steps) {
            for (let i = 3; i < 27; i += 9) {
                for (let j = i; j < i + 3; j++) {
                    const blockNum = locateBlock(blocks[j]);
                    move[blockNum] = move[blockNum].mul(Quaternion.fromAxisAngle([0, 0, -1], Math.PI / steps));
                    let matrix = move[blockNum].toMatrix4();
                    blocks[j].style.transform = `matrix3d(${matrix.join(",")})`;
                }
            }
        }

        function rotateSPrime(steps) {
            for (let i = 3; i < 27; i += 9) {
                for (let j = i; j < i + 3; j++) {
                    const blockNum = locateBlock(blocks[j]);
                    move[blockNum] = move[blockNum].mul(Quaternion.fromAxisAngle([0, 0, 1], Math.PI / steps));
                    let matrix = move[blockNum].toMatrix4();
                    blocks[j].style.transform = `matrix3d(${matrix.join(",")})`;
                }
            }
        }

        function rotateB(steps) {
            for (let i = 6; i < 27; i += 9) {
                for (let j = i; j < i + 3; j++) {
                    const blockNum = locateBlock(blocks[j]);
                    move[blockNum] = move[blockNum].mul(Quaternion.fromAxisAngle([0, 0, 1], Math.PI / steps));
                    let matrix = move[blockNum].toMatrix4();
                    blocks[j].style.transform = `matrix3d(${matrix.join(",")})`;
                }
            }
        }

        function rotateBPrime(steps) {
            for (let i = 6; i < 27; i += 9) {
                for (let j = i; j < i + 3; j++) {
                    const blockNum = locateBlock(blocks[j]);
                    move[blockNum] = move[blockNum].mul(Quaternion.fromAxisAngle([0, 0, -1], Math.PI / steps));
                    let matrix = move[blockNum].toMatrix4();
                    blocks[j].style.transform = `matrix3d(${matrix.join(",")})`;
                }
            }
        }

        function rotateX(steps) {
            for (let i = 0; i < 27; i++) {
                const blockNum = locateBlock(blocks[i]);
                move[blockNum] = move[blockNum].mul(Quaternion.fromAxisAngle([-1, 0, 0], Math.PI / steps));
                let matrix = move[blockNum].toMatrix4();
                blocks[i].style.transform = `matrix3d(${matrix.join(",")})`;
            }
        }

        function rotateXPrime(steps) {
            for (let i = 0; i < 27; i++) {
                const blockNum = locateBlock(blocks[i]);
                move[blockNum] = move[blockNum].mul(Quaternion.fromAxisAngle([1, 0, 0], Math.PI / steps));
                let matrix = move[blockNum].toMatrix4();
                blocks[i].style.transform = `matrix3d(${matrix.join(",")})`;
            }
        }

        function rotateY(steps) {
            for (let i = 0; i < 27; i++) {
                const blockNum = locateBlock(blocks[i]);
                move[blockNum] = move[blockNum].mul(Quaternion.fromAxisAngle([0, 1, 0], Math.PI / steps));
                let matrix = move[blockNum].toMatrix4();
                blocks[i].style.transform = `matrix3d(${matrix.join(",")})`;
            }
        }

        function rotateYPrime(steps) {
            for (let i = 0; i < 27; i++) {
                const blockNum = locateBlock(blocks[i]);
                move[blockNum] = move[blockNum].mul(Quaternion.fromAxisAngle([0, -1, 0], Math.PI / steps));
                let matrix = move[blockNum].toMatrix4();
                blocks[i].style.transform = `matrix3d(${matrix.join(",")})`;
            }
        }

        function rotateZ(steps) {
            for (let i = 0; i < 27; i++) {
                const blockNum = locateBlock(blocks[i]);
                move[blockNum] = move[blockNum].mul(Quaternion.fromAxisAngle([0, 0, -1], Math.PI / steps));
                let matrix = move[blockNum].toMatrix4().map((value) => parseFloat(value.toFixed(6))); // Rounding for better CSS compatibility
                blocks[i].style.transform = `matrix3d(${matrix.join(",")})`;
            }
        }

        function rotateZPrime(steps) {
            for (let i = 0; i < 27; i++) {
                const blockNum = locateBlock(blocks[i]);
                move[blockNum] = move[blockNum].mul(Quaternion.fromAxisAngle([0, 0, 1], Math.PI / steps));
                let matrix = move[blockNum].toMatrix4().map((value) => parseFloat(value.toFixed(6))); // Rounding for better CSS compatibility

                blocks[i].style.transform = `matrix3d(${matrix.join(",")})`;
            }
        }

        function setBlocksPositionFw() {
            setBlocksPositionF();
            setBlocksPositionS();
        }

        function setBlocksPositionFwPrime() {
            setBlocksPositionFPrime();
            setBlocksPositionSPrime();
        }

        function setBlocksPositionUw() {
            setBlocksPositionU();
            setBlocksPositionEPrime();
        }

        function setBlocksPositionUwPrime() {
            setBlocksPositionUPrime();
            setBlocksPositionE();
        }

        function setBlocksPositionLw() {
            setBlocksPositionL();
            setBlocksPositionM();
        }

        function setBlocksPositionLwPrime() {
            setBlocksPositionLPrime();
            setBlocksPositionMPrime();
        }

        function setBlocksPositionRw() {
            setBlocksPositionMPrime();
            setBlocksPositionR();
        }

        function setBlocksPositionRwPrime() {
            setBlocksPositionM();
            setBlocksPositionRPrime();
        }

        function setBlocksPositionX() {
            setBlocksPositionLPrime();
            setBlocksPositionMPrime();
            setBlocksPositionR();
        }

        function setBlocksPositionXPrime() {
            setBlocksPositionL();
            setBlocksPositionM();
            setBlocksPositionRPrime();
        }

        function setBlocksPositionY() {
            setBlocksPositionU();
            setBlocksPositionEPrime();
            setBlocksPositionDPrime();
        }

        function setBlocksPositionYPrime() {
            setBlocksPositionUPrime();
            setBlocksPositionE();
            setBlocksPositionD();
        }

        function setBlocksPositionZ() {
            setBlocksPositionF();
            setBlocksPositionS();
            setBlocksPositionBPrime();
        }

        function setBlocksPositionZPrime() {
            setBlocksPositionFPrime();
            setBlocksPositionSPrime();
            setBlocksPositionB();
        }

        function setBlocksPositionD() {
            let tmp = blocks[0];
            blocks[0] = blocks[6];
            blocks[6] = blocks[8];
            blocks[8] = blocks[2];
            blocks[2] = tmp;
            tmp = blocks[1];
            blocks[1] = blocks[3];
            blocks[3] = blocks[7];
            blocks[7] = blocks[5];
            blocks[5] = tmp;
        }

        function setBlocksPositionDPrime() {
            let tmp = blocks[0];
            blocks[0] = blocks[2];
            blocks[2] = blocks[8];
            blocks[8] = blocks[6];
            blocks[6] = tmp;
            tmp = blocks[1];
            blocks[1] = blocks[5];
            blocks[5] = blocks[7];
            blocks[7] = blocks[3];
            blocks[3] = tmp;
        }

        function setBlocksPositionE() {
            let tmp = blocks[9];
            blocks[9] = blocks[15];
            blocks[15] = blocks[17];
            blocks[17] = blocks[11];
            blocks[11] = tmp;
            tmp = blocks[10];
            blocks[10] = blocks[12];
            blocks[12] = blocks[16];
            blocks[16] = blocks[14];
            blocks[14] = tmp;
        }

        function setBlocksPositionEPrime() {
            let tmp = blocks[9];
            blocks[9] = blocks[11];
            blocks[11] = blocks[17];
            blocks[17] = blocks[15];
            blocks[15] = tmp;
            tmp = blocks[10];
            blocks[10] = blocks[14];
            blocks[14] = blocks[16];
            blocks[16] = blocks[12];
            blocks[12] = tmp;
        }

        function setBlocksPositionU() {
            let tmp = blocks[18];
            blocks[18] = blocks[20];
            blocks[20] = blocks[26];
            blocks[26] = blocks[24];
            blocks[24] = tmp;
            tmp = blocks[19];
            blocks[19] = blocks[23];
            blocks[23] = blocks[25];
            blocks[25] = blocks[21];
            blocks[21] = tmp;
        }

        function setBlocksPositionUPrime() {
            let tmp = blocks[18];
            blocks[18] = blocks[24];
            blocks[24] = blocks[26];
            blocks[26] = blocks[20];
            blocks[20] = tmp;
            tmp = blocks[19];
            blocks[19] = blocks[21];
            blocks[21] = blocks[25];
            blocks[25] = blocks[23];
            blocks[23] = tmp;
        }

        function setBlocksPositionF() {
            let tmp = blocks[18];
            blocks[18] = blocks[0];
            blocks[0] = blocks[2];
            blocks[2] = blocks[20];
            blocks[20] = tmp;
            tmp = blocks[19];
            blocks[19] = blocks[9];
            blocks[9] = blocks[1];
            blocks[1] = blocks[11];
            blocks[11] = tmp;
        }

        // Rotate F’
        // 19	20	21		21	12	3
        // 10	11	12	=>	20	11	2
        // 1	2	3		19	10	1
        function setBlocksPositionFPrime() {
            let tmp = blocks[18];
            blocks[18] = blocks[20];
            blocks[20] = blocks[2];
            blocks[2] = blocks[0];
            blocks[0] = tmp;
            tmp = blocks[19];
            blocks[19] = blocks[11];
            blocks[11] = blocks[1];
            blocks[1] = blocks[9];
            blocks[9] = tmp;
        }

        function setBlocksPositionS() {
            let tmp = blocks[21];
            blocks[21] = blocks[3];
            blocks[3] = blocks[5];
            blocks[5] = blocks[23];
            blocks[23] = tmp;
            tmp = blocks[22];
            blocks[22] = blocks[12];
            blocks[12] = blocks[4];
            blocks[4] = blocks[14];
            blocks[14] = tmp;
        }

        function setBlocksPositionSPrime() {
            let tmp = blocks[21];
            blocks[21] = blocks[23];
            blocks[23] = blocks[5];
            blocks[5] = blocks[3];
            blocks[3] = tmp;
            tmp = blocks[22];
            blocks[22] = blocks[14];
            blocks[14] = blocks[4];
            blocks[4] = blocks[12];
            blocks[12] = tmp;
        }

        function setBlocksPositionB() {
            let tmp = blocks[24];
            blocks[24] = blocks[26];
            blocks[26] = blocks[8];
            blocks[8] = blocks[6];
            blocks[6] = tmp;
            tmp = blocks[25];
            blocks[25] = blocks[17];
            blocks[17] = blocks[7];
            blocks[7] = blocks[15];
            blocks[15] = tmp;
        }

        function setBlocksPositionBPrime() {
            let tmp = blocks[24];
            blocks[24] = blocks[6];
            blocks[6] = blocks[8];
            blocks[8] = blocks[26];
            blocks[26] = tmp;
            tmp = blocks[25];
            blocks[25] = blocks[15];
            blocks[15] = blocks[7];
            blocks[7] = blocks[17];
            blocks[17] = tmp;
        }

        function setBlocksPositionR() {
            let tmp = blocks[20];
            blocks[20] = blocks[2];
            blocks[2] = blocks[8];
            blocks[8] = blocks[26];
            blocks[26] = tmp;
            tmp = blocks[23];
            blocks[23] = blocks[11];
            blocks[11] = blocks[5];
            blocks[5] = blocks[17];
            blocks[17] = tmp;
        }

        function setBlocksPositionRPrime() {
            let tmp = blocks[20];
            blocks[20] = blocks[26];
            blocks[26] = blocks[8];
            blocks[8] = blocks[2];
            blocks[2] = tmp;
            tmp = blocks[23];
            blocks[23] = blocks[17];
            blocks[17] = blocks[5];
            blocks[5] = blocks[11];
            blocks[11] = tmp;
        }

        function setBlocksPositionM() {
            let tmp = blocks[19];
            blocks[19] = blocks[25];
            blocks[25] = blocks[7];
            blocks[7] = blocks[1];
            blocks[1] = tmp;
            tmp = blocks[22];
            blocks[22] = blocks[16];
            blocks[16] = blocks[4];
            blocks[4] = blocks[10];
            blocks[10] = tmp;
        }

        function setBlocksPositionMPrime() {
            let tmp = blocks[19];
            blocks[19] = blocks[1];
            blocks[1] = blocks[7];
            blocks[7] = blocks[25];
            blocks[25] = tmp;
            tmp = blocks[22];
            blocks[22] = blocks[10];
            blocks[10] = blocks[4];
            blocks[4] = blocks[16];
            blocks[16] = tmp;
        }

        function setBlocksPositionL() {
            let tmp = blocks[18];
            blocks[18] = blocks[24];
            blocks[24] = blocks[6];
            blocks[6] = blocks[0];
            blocks[0] = tmp;
            tmp = blocks[21];
            blocks[21] = blocks[15];
            blocks[15] = blocks[3];
            blocks[3] = blocks[9];
            blocks[9] = tmp;
        }

        function setBlocksPositionLPrime() {
            let tmp = blocks[18];
            blocks[18] = blocks[0];
            blocks[0] = blocks[6];
            blocks[6] = blocks[24];
            blocks[24] = tmp;
            tmp = blocks[21];
            blocks[21] = blocks[9];
            blocks[9] = blocks[3];
            blocks[3] = blocks[15];
            blocks[15] = tmp;
        }
    }

    function locateBlock(block) {
        let position = 0;
        let level = 0;
        if (block.classList.contains("position-1")) {
            position = 1;
        } else if (block.classList.contains("position-2")) {
            position = 2;
        } else if (block.classList.contains("position-3")) {
            position = 3;
        } else if (block.classList.contains("position-4")) {
            position = 4;
        } else if (block.classList.contains("position-5")) {
            position = 5;
        } else if (block.classList.contains("position-6")) {
            position = 6;
        } else if (block.classList.contains("position-7")) {
            position = 7;
        } else if (block.classList.contains("position-8")) {
            position = 8;
        } else if (block.classList.contains("position-9")) {
            position = 9;
        }

        if (block.classList.contains("level-1")) {
            level = 1;
        } else if (block.classList.contains("level-2")) {
            level = 2;
        } else if (block.classList.contains("level-3")) {
            level = 3;
        }

        return (level - 1) * 9 + position - 1;
    }

    function setSliderValue(slider, value) {
        if (slider === "x") {
            xScroll.value = value;
            xRotate = xScroll.value;
        } else if (slider === "y") {
            yScroll.value = value;
            yRotate = yScroll.value;
        } else if (slider === "z") {
            zScroll.value = value;
            zRotate = zScroll.value;
        }
    }

    async function generateScramble() {
        scrambleString = await randomScrambleForEvent("333");
    }

    function updateMoveLog(move) {
        if (move === move.toUpperCase()) {
            if (move.includes("Q")) {
                move = move.replace("Q", "Rw");
            } else if (move.includes("T")) {
                move = move.replace("T", "Lw");
            } else if (move.includes("O")) {
                move = move.replace("O", "Fw");
            } else if (move.includes("P")) {
                move = move.replace("P", "Uw");
            }

            if (move === "X" || move === "Y" || move === "Z") {
                if (lastMove === ` ${move.toLowerCase()}'`) {
                    lastMove = "";
                    moveHistoryLog.innerHTML += `2`;
                } else {
                    lastMove = ` ${move.toLowerCase()}'`;
                    moveHistoryLog.innerHTML += lastMove;
                }
            } else {
                if (lastMove === ` ${move}'`) {
                    lastMove = "";
                    moveHistoryLog.innerHTML += `2`;
                } else {
                    lastMove = ` ${move}'`;
                    moveHistoryLog.innerHTML += ` ${move}'`;
                }
            }
        } else {
            if (move === "x" || move === "y" || move === "z") {
                if (lastMove === ` ${move}`) {
                    lastMove = "";
                    moveHistoryLog.innerHTML += `2`;
                } else {
                    lastMove = ` ${move}`;
                    moveHistoryLog.innerHTML += ` ${move}`;
                }
            } else {
                move = move.toUpperCase();
                if (move.includes("Q")) {
                    move = move.replace("Q", "Rw");
                } else if (move.includes("T")) {
                    move = move.replace("T", "Lw");
                } else if (move.includes("O")) {
                    move = move.replace("O", "Fw");
                } else if (move.includes("P")) {
                    move = move.replace("P", "Uw");
                }
                if (lastMove === ` ${move}`) {
                    lastMove = "";
                    moveHistoryLog.innerHTML += `2`;
                } else {
                    lastMove = ` ${move}`;
                    moveHistoryLog.innerHTML += ` ${move}`;
                }
            }
        }

        function compressMoves(inputString) {
            // Split the input string into an array of items
            const items = inputString.split(" ");

            // Initialize an empty array to store the compressed result
            let compressed = [];

            // Variable to track the last item and its count
            let lastItem = null;
            let count = 0;

            // Function to add the last item with the appropriate count to the compressed array
            const addItem = () => {
                if (count === 1) {
                    compressed.push(lastItem);
                } else if (count === 2) {
                    compressed.push(lastItem + "2");
                }
            };

            // Iterate through each item in the array
            for (let item of items) {
                if (item === lastItem) {
                    // Increment count if the current item is the same as the last item
                    count++;
                } else {
                    // If the current item is different, add the last item to the compressed array
                    if (lastItem) {
                        addItem();
                    }
                    // Reset lastItem and count for the new item
                    lastItem = item;
                    count = 1;
                }
            }

            // Add the last item to the compressed array after exiting the loop
            if (lastItem) {
                addItem();
            }

            // Join the compressed items into a single string separated by spaces and return
            return compressed.join(" ");
        }
    }

    function processMoves(input) {
        let result = "";
        // Split the string into parts based on spaces
        let moves = input.split(" ");

        // Loop through each move in the moves array
        moves.forEach((move) => {
            // Trim each move to remove potential leading/trailing whitespace
            move = move.trim();

            // Check if the move has '2' and should be repeated
            let repeatFactor = move.includes("2") ? 2 : 1;

            // Replace wide moves with single letters
            if (move.includes("Rw")) {
                move = move.replace("Rw", "Q");
            } else if (move.includes("Lw")) {
                move = move.replace("Lw", "T");
            } else if (move.includes("Fw")) {
                move = move.replace("Fw", "O");
            } else if (move.includes("Uw")) {
                move = move.replace("Uw", "P");
            }

            if (move.includes("'")) {
                // Remove the apostrophe and the '2', keep the letter uppercase
                let moveWithoutApostrophe = move.replace("'", "").replace("2", "");
                for (let i = 0; i < repeatFactor; i++) {
                    result += moveWithoutApostrophe.toUpperCase();
                }
            } else {
                // Convert the letter to lower case, remove the '2'
                let moveLowerCase = move.replace("2", "").toLowerCase();
                for (let i = 0; i < repeatFactor; i++) {
                    result += moveLowerCase;
                }
            }
        });

        return result;
    }

    function getCurrentState() {
        let result = "";
        let centerColorsMap = getCenterColors();

        for (let i = 24; i > 17; i -= 3) {
            for (let j = i; j < i + 3; j++) {
                const upside = findSide(blocks[j], "up");
                const upColor = getFaceLetter(blocks[j].querySelector(`.${upside}`));
                result += upColor;
            }
        }
        for (let i = 20; i > 0; i -= 9) {
            for (let j = i; j < i + 9; j += 3) {
                const rightSide = findSide(blocks[j], "right");
                const rightColor = getFaceLetter(blocks[j].querySelector(`.${rightSide}`));
                result += rightColor;
            }
        }
        for (let i = 18; i >= 0; i -= 9) {
            for (let j = i; j < i + 3; j++) {
                const frontSide = findSide(blocks[j], "front");
                const frontColor = getFaceLetter(blocks[j].querySelector(`.${frontSide}`));
                result += frontColor;
            }
        }
        for (let i = 0; i < 9; i++) {
            const downSide = findSide(blocks[i], "down");
            const downColor = getFaceLetter(blocks[i].querySelector(`.${downSide}`));
            result += downColor;
        }
        for (let i = 24; i >= 0; i -= 3) {
            const leftside = findSide(blocks[i], "left");
            const leftColor = getFaceLetter(blocks[i].querySelector(`.${leftside}`));
            result += leftColor;
        }
        for (let i = 26; i > 0; i -= 9) {
            for (let j = i; j > i - 3; j--) {
                const backSide = findSide(blocks[j], "back");
                const backColor = getFaceLetter(blocks[j].querySelector(`.${backSide}`));
                result += backColor;
            }
        }
        return result;

        function getCenterColors() {
            const centerColors = {};

            const frontSide = findSide(blocks[10], "front");
            const frontColor = getColor(blocks[10].querySelector(`.${frontSide}`));
            centerColors["front"] = frontColor;

            const backSide = findSide(blocks[16], "back");
            const backColor = getColor(blocks[16].querySelector(`.${backSide}`));
            centerColors["back"] = backColor;

            const rightSide = findSide(blocks[14], "right");
            const rightColor = getColor(blocks[14].querySelector(`.${rightSide}`));
            centerColors["right"] = rightColor;

            const leftSide = findSide(blocks[12], "left");
            const leftColor = getColor(blocks[12].querySelector(`.${leftSide}`));
            centerColors["left"] = leftColor;

            const upSide = findSide(blocks[22], "up");
            const upColor = getColor(blocks[22].querySelector(`.${upSide}`));
            centerColors["up"] = upColor;

            const downSide = findSide(blocks[4], "down");
            const downColor = getColor(blocks[4].querySelector(`.${downSide}`));
            centerColors["down"] = downColor;

            return centerColors;
        }

        function getFaceLetter(element) {
            if (element.classList.contains(centerColorsMap["front"])) {
                return "F";
            } else if (element.classList.contains(centerColorsMap["left"])) {
                return "L";
            } else if (element.classList.contains(centerColorsMap["back"])) {
                return "B";
            } else if (element.classList.contains(centerColorsMap["right"])) {
                return "R";
            } else if (element.classList.contains(centerColorsMap["up"])) {
                return "U";
            } else if (element.classList.contains(centerColorsMap["down"])) {
                return "D";
            } else {
                return "error";
            }
        }

        function getColor(element) {
            if (element.classList.contains("red")) {
                return "red";
            } else if (element.classList.contains("blue")) {
                return "blue";
            } else if (element.classList.contains("orange")) {
                return "orange";
            } else if (element.classList.contains("green")) {
                return "green";
            } else if (element.classList.contains("yellow")) {
                return "yellow";
            } else if (element.classList.contains("white")) {
                return "white";
            } else if (element.classList.contains("black")) {
                return "black";
            }
        }

        function findSide(element, side) {
            // Define the original normals of the cube faces
            const normals = {
                up: [0, -1, 0],
                down: [0, 1, 0],
                left: [-1, 0, 0],
                right: [1, 0, 0],
                front: [0, 0, 1],
                back: [0, 0, -1],
            };

            const style = window.getComputedStyle(element);
            const transform = style.transform;

            let rotationMatrix = getRotationMatrix(transform);

            // Apply rotation to each normal and calculate the dot product with the up vector [0, 1, 0]
            let maxDot = -Infinity;
            let returnFace = null;

            const vector = normals[side]; // Up direction vector
            for (const [face, normal] of Object.entries(normals)) {
                const transformedNormal = applyMatrix(normal, rotationMatrix);
                // Calculate the dot product with the up vector
                const dotProduct =
                    transformedNormal[0] * vector[0] +
                    transformedNormal[1] * vector[1] +
                    transformedNormal[2] * vector[2];

                if (dotProduct > maxDot) {
                    maxDot = dotProduct;
                    returnFace = face;
                }
            }
            return returnFace;

            function applyMatrix(vector, rotationMatrix) {
                return [
                    vector[0] * rotationMatrix[0][0] +
                        vector[1] * rotationMatrix[1][0] +
                        vector[2] * rotationMatrix[2][0],
                    vector[0] * rotationMatrix[0][1] +
                        vector[1] * rotationMatrix[1][1] +
                        vector[2] * rotationMatrix[2][1],
                    vector[0] * rotationMatrix[0][2] +
                        vector[1] * rotationMatrix[1][2] +
                        vector[2] * rotationMatrix[2][2],
                ];
            }

            function getRotationMatrix(transform) {
                // Check for no transformation, 2D matrix, or 3D matrix
                let matrixValues;
                if (transform.startsWith("matrix3d(")) {
                    matrixValues = transform.slice(9, -1).split(", ").map(parseFloat);
                } else if (transform.startsWith("matrix(")) {
                    const temp = transform.slice(7, -1).split(", ").map(parseFloat);
                    // Extend 2D matrix to 3D matrix equivalent values
                    matrixValues = [
                        temp[0],
                        temp[1],
                        0,
                        0, // m11, m21, m13, m14
                        temp[2],
                        temp[3],
                        0,
                        0, // m12, m22, m23, m24
                        0,
                        0,
                        1,
                        0, // m31, m32, m33, m34
                        0,
                        0,
                        0,
                        1, // m41, m42, m43, m44
                    ];
                } else if (transform === "none") {
                    return [
                        [1, 0, 0],
                        [0, 1, 0],
                        [0, 0, 1],
                    ]; // No transformation implies 'left' is still 'left'
                }

                if (!matrixValues) {
                    console.error("Unsupported transform format:", transform);
                    return "unknown"; // Exit if format not recognized
                }

                const rotationMatrix = [
                    [matrixValues[0], matrixValues[1], matrixValues[2]],
                    [matrixValues[4], matrixValues[5], matrixValues[6]],
                    [matrixValues[8], matrixValues[9], matrixValues[10]],
                ];

                return rotationMatrix;
            }
        }
    }

    async function solveCube(cubeState) {
        try {
            const response = await fetch("/solve-cube", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({cubeString: cubeState}),
            });

            const result = await response.json();
            if (response.ok) {
                solvingOrScrambling = true;
                if (lastMove === "solveOrScramble") {
                    moveHistoryLog.innerHTML += "SOLVE: (";
                } else {
                    moveHistoryLog.innerHTML += "<br><br>SOLVE: (";
                }
                lastMove = "";
                rotate(processMoves(result.solution));
            } else {
                console.error("Error");
            }
        } catch (error) {
            console.error("Request failed", error);
        }
    }

    function setUpInitialCubeTilt(xTilt, yTilt) {
        // Rotate the cube a little bit, making it a tilted, so viewers can see three sides of the cube.
        cubeQuaternion = cubeQuaternion
            .mul(Quaternion.fromAxisAngle([0, -1, 0], xTilt))
            .mul(Quaternion.fromAxisAngle([1, 0, 0], yTilt));
        // Convert the quaternion object to matrix
        let matrix = cubeQuaternion.toMatrix4();
        // Apply the matrix to the transfrom property of cube
        cube.style.transform = `matrix3d(${matrix.join(",")})`;

        setSliderValue("z", 50 - (xTilt / Math.PI) * 50);
        setSliderValue("y", 50 + (yTilt / Math.PI) * 50);
        setSliderValue("x", 50);
    }

    function resetCube() {
        cubeQuaternion = new Quaternion(1, 0, 0, 0);
        let matrix = cubeQuaternion.toMatrix4();
        cube.style.transform = `matrix3d(${matrix.join(",")})`;
        setUpInitialCubeTilt(-Math.PI / 4, Math.PI / 12);
        moveHistoryLog.innerHTML = "";
        lastMove = "solveOrScramble";

        for (let i = 0; i < 27; i++) {
            move[i] = new Quaternion(1, 0, 0, 0);
            let matrix = move[i].toMatrix4();
            blocks[i].style.transform = `matrix3d(${matrix.join(",")})`;
        }
        blocks = Array.from(blocksNodeList);
        stop = false;
        turning = false;
    }

    function setAxes() {
        for (let i = 0; i < 27; i++) {
            const blockNum = locateBlock(blocks[i]);
            if (blockNum === 0 || blockNum === 3 || blockNum === 6) {
                blocks[i].style.transformOrigin = `${sideLength / 2}px -${sideLength / 6}px 0px`;
            } else if (blockNum === 1 || blockNum === 4 || blockNum === 7) {
                blocks[i].style.transformOrigin = `${sideLength / 6}px -${sideLength / 6}px 0px`;
            } else if (blockNum === 2 || blockNum === 5 || blockNum === 8) {
                blocks[i].style.transformOrigin = `-${sideLength / 6}px -${sideLength / 6}px 0px`;
            } else if (blockNum === 9 || blockNum === 12 || blockNum === 15) {
                blocks[i].style.transformOrigin = `${sideLength / 2}px ${sideLength / 6}px 0px`;
            } else if (blockNum === 10 || blockNum === 13 || blockNum === 16) {
                blocks[i].style.transformOrigin = `${sideLength / 6}px ${sideLength / 6}px 0px`;
            } else if (blockNum === 11 || blockNum === 14 || blockNum === 17) {
                blocks[i].style.transformOrigin = `-${sideLength / 6}px ${sideLength / 6}px 0px`;
            } else if (blockNum === 18 || blockNum === 21 || blockNum === 24) {
                blocks[i].style.transformOrigin = `${sideLength / 2}px ${sideLength / 2}px 0px`;
            } else if (blockNum === 19 || blockNum === 22 || blockNum === 25) {
                blocks[i].style.transformOrigin = `${sideLength / 6}px ${sideLength / 2}px 0px`;
            } else if (blockNum === 20 || blockNum === 23 || blockNum === 26) {
                blocks[i].style.transformOrigin = `-${sideLength / 6}px ${sideLength / 2}px 0px`;
            }
        }
    }

    function updateButtonText() {
        if (parseInt(window.innerWidth) < 1000) {
            basicRotationsButton.innerText = "BASIC";
            if (listOfPllRotationButtons[0].innerText.length > 7) {
                listOfPllRotationButtons.forEach((button) => {
                    button.innerText = button.innerText.slice(0, -7);
                });
            }
        } else if (parseInt(window.innerWidth) > 1010) {
            basicRotationsButton.innerText = "BASIC TURNS";
            if (listOfPllRotationButtons[0].innerText.length < 5) {
                listOfPllRotationButtons.forEach((button) => {
                    button.innerText += " - Perm";
                });
            }
        }
    }

    function init() {
        computedStyle = window.getComputedStyle(cube);
        sideLength = parseInt(computedStyle.getPropertyValue("width"));
        xRotate = xScroll.value;
        yRotate = yScroll.value;
        zRotate = zScroll.value;
        blocks = Array.from(blocksNodeList);
        resetCube();
        setAxes();
        loadCSVData();
        generateScramble();
        updateButtonText();

        async function loadCSVData() {
            try {
                const response = await fetch("/data");
                algorithms = await response.json();
            } catch (error) {
                console.error("Error loading CSV data:", error);
            }
        }
    }

    const cubeContainer = document.querySelector(".cube-container");
    const cube = document.querySelector(".cube");
    const blocksNodeList = document.querySelectorAll(".block");
    const xScroll = document.getElementById("x-slide");
    const yScroll = document.getElementById("y-slide");
    const zScroll = document.getElementById("z-slide");
    const fastButton = document.querySelector(".fast-button");
    const normalButton = document.querySelector(".normal-button");
    const slowButton = document.querySelector(".slow-button");
    const slideButton = document.querySelector(".slide-button");
    const dragButton = document.querySelector(".drag-button");
    const sliders = document.querySelector(".sliders");
    const resetButton = document.querySelector(".reset-button");
    const scrambleButton = document.querySelector(".scramble-button");
    const solveButton = document.querySelector(".solve-button");
    const dragInstruction = document.querySelector(".drag-instruction");
    const rotationResetButton = document.querySelector(".rotation-reset-button");
    const basicRotationsButton = document.querySelector(".basic-rotations-button");
    const ollButton = document.querySelector(".oll-button");
    const pllButton = document.querySelector(".pll-button");
    const basicRotations = document.querySelector(".basic-rotations");
    const ollRotations = document.querySelector(".oll-rotations");
    const pllRotations = document.querySelector(".pll-rotations");
    const listOfPllRotationButtons = pllRotations.querySelectorAll("button");
    const moveHistoryLog = document.querySelector(".move-history-log");

    // Start the website;
    init();

    scrambleButton.addEventListener("click", () => {
        if (turning) {
            return;
        }
        solvingOrScrambling = true;
        if (lastMove === "solveOrScramble") {
            moveHistoryLog.innerHTML += "SCRAMBLE: (";
        } else {
            moveHistoryLog.innerHTML += "<br><br>SCRAMBLE: (";
        }
        lastMove = "";
        rotate(processMoves(scrambleString.toString()));

        generateScramble();
    });

    resetButton.addEventListener("click", () => {
        if (turning) {
            stop = true;
        } else {
            resetCube();
        }
    });

    solveButton.addEventListener("click", () => {
        if (turning) {
            return;
        }
        const currentState = getCurrentState();
        const solution = solveCube(currentState);
        // console.log(solution);
    });

    basicRotations.addEventListener("click", (event) => {
        // Check if the clicked element is a button
        if (event.target.tagName === "BUTTON") {
            // console.log('Clicked button id:', event.target.id);
            rotate(event.target.id);
        }
    });

    ollRotations.addEventListener("click", (event) => {
        // Check if the clicked element is a button
        if (event.target.tagName === "BUTTON") {
            //
            // console.log('Clicked button id:', event.target.id);
            rotate(processMoves(algorithms[event.target.id]));
        }
    });

    pllRotations.addEventListener("click", (event) => {
        // Check if the clicked element is a button
        if (event.target.tagName === "BUTTON") {
            // console.log('Clicked button id:', event.target.id);
            rotate(processMoves(algorithms[event.target.id]));
        }
    });

    rotationResetButton.addEventListener("click", () => {
        cubeQuaternion = new Quaternion(1, 0, 0, 0);
        let matrix = cubeQuaternion.toMatrix4();
        cube.style.transform = `matrix3d(${matrix.join(",")})`;
        setUpInitialCubeTilt(-Math.PI / 4, Math.PI / 12);
    });

    basicRotationsButton.addEventListener("click", () => {
        basicRotationsButton.style.filter = "brightness(70%)";
        ollButton.style.filter = "brightness(100%)";
        pllButton.style.filter = "brightness(100%)";

        basicRotations.style.display = "block";
        ollRotations.style.display = "none";
        pllRotations.style.display = "none";
    });

    ollButton.addEventListener("click", () => {
        ollButton.style.filter = "brightness(70%)";
        basicRotationsButton.style.filter = "brightness(100%)";
        pllButton.style.filter = "brightness(100%)";

        basicRotations.style.display = "none";
        ollRotations.style.display = "block";
        pllRotations.style.display = "none";
    });

    pllButton.addEventListener("click", () => {
        pllButton.style.filter = "brightness(70%)";
        ollButton.style.filter = "brightness(100%)";
        basicRotationsButton.style.filter = "brightness(100%)";

        basicRotations.style.display = "none";
        ollRotations.style.display = "none";
        pllRotations.style.display = "block";
    });

    slideButton.addEventListener("click", () => {
        if (slideOrDrag === "slide") {
            return;
        }
        slideOrDrag = "slide";
        dragButton.style.filter = "brightness(100%)";
        slideButton.style.filter = "brightness(70%)";
        sliders.style.display = "block";
        const {xAngle, yAngle, zAngle} = getRotationXYZ(cube);
        // console.log(`Rotation around X-axis: ${xAngle} degrees`);
        // console.log(`Rotation around Y-axis: ${yAngle} degrees`);
        // console.log(`Rotation around Z-axis: ${zAngle} degrees`);

        setSliderValue("x", (zAngle / 180) * 50 + 50);
        setSliderValue("y", (xAngle / 180) * 50 + 50);
        setSliderValue("z", (yAngle / 180) * 50 + 50);

        function getRotationXYZ(element) {
            const style = window.getComputedStyle(element);
            let transform = style.transform;

            // Normalize transform to remove any leading/trailing whitespace
            transform = transform.trim();

            let values;
            if (transform.startsWith("matrix3d(")) {
                values = transform.slice(9, -1).split(",").map(parseFloat);
            } else if (transform.startsWith("matrix(")) {
                const temp = transform.slice(7, -1).split(",").map(parseFloat);
                // Assume the rotation around Z-axis only for 2D matrix and no 3D rotation components
                values = [temp[0], temp[1], 0, 0, -temp[1], temp[0], 0, 0, 0, 0, 1, 0, temp[4], temp[5], 0, 1];
            }

            if (values) {
                // Rotation around the Y-axis (φ)
                const sinPhi = -values[8]; // m31, sin(φ)
                const cosPhi = Math.sqrt(1 - sinPhi * sinPhi); // cos(φ), calculated as sqrt(1 - sin^2(φ))
                const yAngle = Math.atan2(sinPhi, cosPhi) * (180 / Math.PI); // Convert to degrees

                // Rotation around the X-axis (θ)
                let sinTheta = values[9] / cosPhi; // m32 / cos(φ)
                let cosTheta = values[10] / cosPhi; // m33 / cos(φ)
                const xAngle = Math.atan2(sinTheta, cosTheta) * (180 / Math.PI); // Convert to degrees

                // Rotation around the Z-axis (ψ)
                let sinPsi = values[4] / cosPhi; // m21 / cos(φ)
                let cosPsi = values[0] / cosPhi; // m11 / cos(φ)
                const zAngle = Math.atan2(sinPsi, cosPsi) * (180 / Math.PI); // Convert radians to degrees

                return {xAngle, yAngle, zAngle};
            }

            return {xAngle: 0, yAngle: 0, zAngle: 0};
        }
    });

    dragButton.addEventListener("click", () => {
        if (slideOrDrag === "drag") {
            return;
        }
        slideOrDrag = "drag";
        slideButton.style.filter = "brightness(100%)";
        dragButton.style.filter = "brightness(70%)";
        sliders.style.display = "none";
        dragInstruction.style.display = "block";
    });

    fastButton.addEventListener("click", () => {
        if (stepInterval === 10) {
            return;
        }
        normalButton.style.filter = "brightness(100%)";
        slowButton.style.filter = "brightness(100%)";
        fastButton.style.filter = "brightness(70%)";
        stepInterval = 10;
        rotateSteps = 24;
    });

    normalButton.addEventListener("click", () => {
        if (stepInterval === 20) {
            return;
        }
        fastButton.style.filter = "brightness(100%)";
        slowButton.style.filter = "brightness(100%)";
        normalButton.style.filter = "brightness(70%)";
        stepInterval = 20;
        rotateSteps = 32;
    });

    slowButton.addEventListener("click", () => {
        if (stepInterval === 25) {
            return;
        }
        normalButton.style.filter = "brightness(100%)";
        fastButton.style.filter = "brightness(100%)";
        slowButton.style.filter = "brightness(70%)";
        stepInterval = 25;
        rotateSteps = 64;
    });

    xScroll.addEventListener("input", (event) => {
        let deltaX = event.target.value - xRotate;
        xRotate = event.target.value;
        cubeQuaternion = cubeQuaternion.mul(Quaternion.fromAxisAngle([0, 0, 1], (deltaX * Math.PI) / 50));
        let matrix = cubeQuaternion.toMatrix4();
        cube.style.transform = `matrix3d(${matrix.join(",")})`;
    });

    yScroll.addEventListener("input", (event) => {
        let deltaY = event.target.value - yRotate;
        yRotate = event.target.value;
        cubeQuaternion = cubeQuaternion.mul(Quaternion.fromAxisAngle([1, 0, 0], (deltaY * Math.PI) / 50));
        let matrix = cubeQuaternion.toMatrix4();
        cube.style.transform = `matrix3d(${matrix.join(",")})`;
    });

    zScroll.addEventListener("input", (event) => {
        let deltaZ = event.target.value - zRotate;
        zRotate = event.target.value;
        cubeQuaternion = cubeQuaternion.mul(Quaternion.fromAxisAngle([0, 1, 0], (deltaZ * Math.PI) / 50));
        let matrix = cubeQuaternion.toMatrix4();
        cube.style.transform = `matrix3d(${matrix.join(",")})`;
    });

    window.addEventListener("resize", () => {
        computedStyle = window.getComputedStyle(cube);
        sideLength = parseInt(computedStyle.getPropertyValue("width"));
        setAxes();
        for (let i = 0; i < 27; i++) {
            let matrix = move[locateBlock(blocks[i])].toMatrix4();
            blocks[i].style.transform = `matrix3d(${matrix.join(",")})`;
        }

        updateButtonText();
    });

    // Listen to events when we click on the mouse
    // Set isDragging to true
    // Record the x and y coordinates of where the mouse is at
    cubeContainer.addEventListener("mousedown", (event) => {
        if (slideOrDrag === "drag") {
            isDragging = true;
            startX = event.pageX;
            startY = event.pageY;
        }
    });

    // As long as the mouse is still dragging (still clicked), we rotate the cube.
    cubeContainer.addEventListener("mousemove", (event) => {
        // check if the mouse is still dragging
        if (isDragging) {
            const deltaX = event.pageX - startX;
            const deltaY = event.pageY - startY;

            // Calculate angle of rotation based on mouse movement
            let angleX = deltaY * 0.003; // Small rotation angle
            let angleY = -deltaX * 0.003;

            // Create quaternion based on axis-angle representation
            let rotationX = Quaternion.fromAxisAngle([1, 0, 0], angleX); // Rotation around x-axis
            let rotationY = Quaternion.fromAxisAngle([0, 1, 0], angleY); // Rotation around y-axis

            // Combine rotations and apply to cube's current orientation
            cubeQuaternion = cubeQuaternion.mul(rotationX).mul(rotationY);

            // Convert quaternion back to matrix and apply as CSS transform
            let matrix = cubeQuaternion.toMatrix4();
            cube.style.transform = `matrix3d(${matrix.join(",")})`;

            // Update start position for next calculation
            startX = event.pageX;
            startY = event.pageY;
        }
    });

    // If the mouse is up, set isDragging to false.
    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    // Detect if any key is pressed
    document.addEventListener("keydown", (event) => {
        if (event.key === " ") {
        } else {
            if (event.key.length === 1) {
                rotate(event.key);
            }
        }
    });
});
