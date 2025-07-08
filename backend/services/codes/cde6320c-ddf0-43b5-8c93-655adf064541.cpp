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
    int n = nums1.size();
        int m = nums2.size();
        int i = 0, j = 0, m1 = 0, m2 = 0;

        // Find median.
        for (int count = 0; count <= (n + m) / 2; count++) {
            m2 = m1;
            if (i != n && j != m) {
                if (nums1[i] > nums2[j]) {
                    m1 = nums2[j++];
                } else {
                    m1 = nums1[i++];
                }
            } else if (i < n) {
                m1 = nums1[i++];
            } else {
                m1 = nums2[j++];
            }
        }

        // Check if the sum of n and m is odd.
        if ((n + m) % 2 == 1) {
            return static_cast<double>(m1);
        } else {
            double ans = static_cast<double>(m1) + static_cast<double>(m2);
            return ans / 2.0;
        }
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