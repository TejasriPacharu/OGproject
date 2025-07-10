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

double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2){
    // Your code here
}

int main() {
    string line;

    vector<int> nums1;
    if (getline(cin, line)) {
        line.erase(remove(line.begin(), line.end(), '['), line.end());
        line.erase(remove(line.begin(), line.end(), ']'), line.end());
        istringstream stream_nums1(line);
        string token_nums1;
        while (getline(stream_nums1, token_nums1, ',')) {
            nums1.push_back(stoi(token_nums1));
        }
    }

    vector<int> nums2;
    if (getline(cin, line)) {
        line.erase(remove(line.begin(), line.end(), '['), line.end());
        line.erase(remove(line.begin(), line.end(), ']'), line.end());
        istringstream stream_nums2(line);
        string token_nums2;
        while (getline(stream_nums2, token_nums2, ',')) {
            nums2.push_back(stoi(token_nums2));
        }
    }

    auto result = findMedianSortedArrays(nums1, nums2);
    
    cout << fixed << setprecision(2) << result << endl;

    return 0;
}