#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
#include <cmath>
#include <queue>
#include <stack>
#include <sstream>

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
    std::vector<int> nums;
    std::string line;
    int target;
    
    // Read input from stdin
    if (std::getline(std::cin, line)) {
        std::istringstream iss(line);
        std::string numStr;
        
        // Remove brackets
        line.erase(std::remove(line.begin(), line.end(), '['), line.end());
        line.erase(std::remove(line.begin(), line.end(), ']'), line.end());
        
        std::istringstream numStream(line);
        std::string numToken;
        
        // Parse comma-separated numbers
        while (std::getline(numStream, numToken, ',')) {
            nums.push_back(std::stoi(numToken));
        }
        
        // Read target value
        if (std::getline(std::cin, line)) {
            target = std::stoi(line);
        }
    }
    
    // Call the solution function
    auto result = twoSum(nums, target);
    
    // Print result
    std::cout << "[";
    for (size_t i = 0; i < result.size(); i++) {
        std::cout << result[i];
        if (i < result.size() - 1) std::cout << ",";
    }
    std::cout << "]" << std::endl;
    
    return 0;
}