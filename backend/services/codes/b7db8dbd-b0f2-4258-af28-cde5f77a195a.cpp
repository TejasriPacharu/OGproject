#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
#include <cmath>
#include <queue>
#include <stack>
#include <sstream>
#include <iomanip>

using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
}

int main() {
    string line;

    vector<int> nums;
    if (getline(cin, line)) {
        line.erase(remove(line.begin(), line.end(), '['), line.end());
        line.erase(remove(line.begin(), line.end(), ']'), line.end());
        istringstream stream_nums(line);
        string token_nums;
        while (getline(stream_nums, token_nums, ',')) {
            nums.push_back(stoi(token_nums));
        }
    }

    int target;
    if (getline(cin, line)) {
        target = stoi(line);
    }

    auto result = twoSum(nums, target);
    
    cout << "[";
    for (size_t i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;

    return 0;
}