import kociemba
import sys

try:
    solution = kociemba.solve(sys.argv[1])
    print(solution.strip())  # Strip any leading or trailing whitespace, including newlines
except ValueError as e:
    print(f"Error: {e}")



