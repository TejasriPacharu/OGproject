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

int lengthOfLongestSubstring(string s){
    int n = s.size();
        int maxLength = 0;
        unordered_map<char, int> charHashMap;
        int left = 0;

        for (int right = 0; right < s.size(); right++) {
            if (charHashMap.count(s[right]) && charHashMap[s[right]] >= left) {
                left = charHashMap[s[right]] + 1;
            }
            charHashMap[s[right]] = right;
            maxLength = max(maxLength, right - left + 1);
        }

        return maxLength;
}

int main() {
    string line;

    string s;
    if (getline(cin, line)) {
        s = line;
    }

    auto result = lengthOfLongestSubstring(s);
    
    cout << result << endl;

    return 0;
}