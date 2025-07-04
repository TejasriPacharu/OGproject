#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
#include <cmath>
#include <queue>
#include <stack>
#include <sstream>

using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
    unordered_map<int, int> numMap;
    int n = nums.size();

    for (int i = 0; i < n; i++) {
      int complement = target - nums[i];
        if (numMap.count(complement)) {
                return {numMap[complement], i};
        }
        numMap[nums[i]] = i;
    }
    return {};
}

// Main function to test the solution
int main() {
    // This is just a placeholder
    // The actual input will be provided via input file
    vector<int> nums;
    string line;
    int target;
    
    // Read input from stdin
    if (getline(cin, line)) {
        // Remove brackets
        line.erase(remove(line.begin(), line.end(), '['), line.end());
        line.erase(remove(line.begin(), line.end(), ']'), line.end());
        
        istringstream numStream(line);
        string numToken;
        
        // Parse comma-separated numbers
        while (getline(numStream, numToken, ',')) {
            nums.push_back(stoi(numToken));
        }
        
        // Read target value
        if (getline(cin, line)) {
            target = stoi(line);
        }
    }
    
    // Call the solution function
    auto result = twoSum(nums, target);
    
    // Print result
    cout << "[";
    for (size_t i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    
    return 0;
}