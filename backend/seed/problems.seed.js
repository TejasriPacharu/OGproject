const mongoose = require("mongoose");
const Problem = require("../models/Problem");

const MONGO_URI = ""; // to be added 

const problems = [
  {
  slug: "trapping-rain-water",
  title: "Trapping Rain Water",
  description:
    "Compute how much water it can trap after raining.",
  difficulty: "Hard",
  tags: ["Stack", "Two Pointers"],
  input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
  codeStubs: [{
    cpp: "int trap(vector<int>& height) {}",
    java: "int trap(int[] height) {}",
    python: "def trap(self, height):",
    js: "function trap(height) {}"
  }],
  output: [{ cpp: "6", java: "6", python: "6", js: "6" }],
  constraints: "1 ≤ height.length ≤ 10^5",
  createdBy: "admin",
  testCases: [{
    input: "0 1 0 2 1 0 1 3 2 1 2 1",
    output: "6",
    sample: true
  }]
},
{
  slug: "median-of-two-sorted-arrays",
  title: "Median of Two Sorted Arrays",
  description:
    "Find the median of two sorted arrays in O(log(m+n)) time.",
  difficulty: "Hard",
  tags: ["Binary Search", "Divide and Conquer"],
  input: "nums1 = [1,3], nums2 = [2]",
  codeStubs: [{
    cpp: "double findMedianSortedArrays(vector<int>& a, vector<int>& b) {}",
    java: "double findMedianSortedArrays(int[] a, int[] b) {}",
    python: "def findMedianSortedArrays(self, a, b):",
    js: "function findMedianSortedArrays(a, b) {}"
  }],
  output: [{ cpp: "2.0", java: "2.0", python: "2.0", js: "2.0" }],
  constraints: "0 ≤ nums1.length, nums2.length ≤ 10^5",
  createdBy: "admin",
  testCases: [{
    input: "1 3 | 2",
    output: "2.0",
    sample: true
  }]
},
{
  slug: "regular-expression-matching",
  title: "Regular Expression Matching",
  description:
    "Implement regular expression matching with support for '.' and '*'.",
  difficulty: "Hard",
  tags: ["DP", "String"],
  input: "s = \"aa\", p = \"a*\"",
  codeStubs: [{
    cpp: "bool isMatch(string s, string p) {}",
    java: "boolean isMatch(String s, String p) {}",
    python: "def isMatch(self, s, p):",
    js: "function isMatch(s, p) {}"
  }],
  output: [{ cpp: "true", java: "true", python: "True", js: "true" }],
  constraints: "1 ≤ s.length ≤ 20",
  createdBy: "admin",
  testCases: [{
    input: "aa a*",
    output: "true",
    sample: true
  }]
},
{
  slug: "product-of-array-except-self",
  title: "Product of Array Except Self",
  description:
    "Return an array such that each element is the product of all other elements.",
  difficulty: "Medium",
  tags: ["Array", "Prefix Sum"],
  input: "nums = [1,2,3,4]",
  codeStubs: [{
    cpp: "vector<int> productExceptSelf(vector<int>& nums) {}",
    java: "int[] productExceptSelf(int[] nums) {}",
    python: "def productExceptSelf(self, nums):",
    js: "function productExceptSelf(nums) {}"
  }],
  output: [{ cpp: "[24,12,8,6]", java: "[24,12,8,6]", python: "[24,12,8,6]", js: "[24,12,8,6]" }],
  constraints: "2 ≤ nums.length ≤ 10^5",
  createdBy: "admin",
  testCases: [{
    input: "1 2 3 4",
    output: "24 12 8 6",
    sample: true
  }]
},
{
  slug: "container-with-most-water",
  title: "Container With Most Water",
  description:
    "Find two lines that together with the x-axis form a container that holds the most water.",
  difficulty: "Medium",
  tags: ["Two Pointers", "Greedy"],
  input: "height = [1,8,6,2,5,4,8,3,7]",
  codeStubs: [{
    cpp: "int maxArea(vector<int>& height) {}",
    java: "int maxArea(int[] height) {}",
    python: "def maxArea(self, height):",
    js: "function maxArea(height) {}"
  }],
  output: [{ cpp: "49", java: "49", python: "49", js: "49" }],
  constraints: "2 ≤ height.length ≤ 10^5",
  createdBy: "admin",
  testCases: [{
    input: "1 8 6 2 5 4 8 3 7",
    output: "49",
    sample: true
  }]
},
{
  slug: "longest-substring-without-repeating",
  title: "Longest Substring Without Repeating Characters",
  description:
    "Given a string s, find the length of the longest substring without repeating characters.",
  difficulty: "Medium",
  tags: ["String", "Sliding Window"],
  input: "s = \"abcabcbb\"",
  codeStubs: [{
    cpp: "int lengthOfLongestSubstring(string s) {}",
    java: "int lengthOfLongestSubstring(String s) {}",
    python: "def lengthOfLongestSubstring(self, s):",
    js: "function lengthOfLongestSubstring(s) {}"
  }],
  output: [{ cpp: "3", java: "3", python: "3", js: "3" }],
  constraints: "0 ≤ s.length ≤ 10^5",
  createdBy: "admin",
  testCases: [{
    input: "abcabcbb",
    output: "3",
    sample: true,
    explanation: "Substring 'abc'."
  }]
},
{
  slug: "reverse-string",
  title: "Reverse String",
  description:
    "Write a function that reverses a string. The input string is given as an array of characters.",
  difficulty: "Easy",
  tags: ["Two Pointers", "String"],
  input: "s = ['h','e','l','l','o']",
  codeStubs: [{
    cpp: "void reverseString(vector<char>& s) {}",
    java: "void reverseString(char[] s) {}",
    python: "def reverseString(self, s):",
    js: "function reverseString(s) {}"
  }],
  output: [{
    cpp: "['o','l','l','e','h']",
    java: "['o','l','l','e','h']",
    python: "['o','l','l','e','h']",
    js: "['o','l','l','e','h']"
  }],
  constraints: "1 ≤ s.length ≤ 10^5",
  createdBy: "admin",
  testCases: [{
    input: "h e l l o",
    output: "o l l e h",
    sample: true
  }]
},
{
  slug: "best-time-to-buy-sell-stock",
  title: "Best Time to Buy and Sell Stock",
  description:
    "You want to maximize your profit by choosing a single day to buy one stock and a different day to sell.",
  difficulty: "Easy",
  tags: ["Array", "Greedy"],
  input: "prices = [7,1,5,3,6,4]",
  codeStubs: [{
    cpp: "int maxProfit(vector<int>& prices) {}",
    java: "int maxProfit(int[] prices) {}",
    python: "def maxProfit(self, prices):",
    js: "function maxProfit(prices) {}"
  }],
  output: [{ cpp: "5", java: "5", python: "5", js: "5" }],
  constraints: "1 ≤ prices.length ≤ 10^5",
  createdBy: "admin",
  testCases: [{
    input: "7 1 5 3 6 4",
    output: "5",
    sample: true,
    explanation: "Buy at 1 and sell at 6."
  }]
},
{
  slug: "contains-duplicate",
  title: "Contains Duplicate",
  description:
    "Given an integer array nums, return true if any value appears at least twice in the array.",
  difficulty: "Easy",
  tags: ["Array", "HashSet"],
  input: "nums = [1,2,3,1]",
  codeStubs: [{
    cpp: "bool containsDuplicate(vector<int>& nums) {}",
    java: "boolean containsDuplicate(int[] nums) {}",
    python: "def containsDuplicate(self, nums):",
    js: "function containsDuplicate(nums) {}"
  }],
  output: [{
    cpp: "true", java: "true", python: "True", js: "true"
  }],
  constraints: "1 ≤ nums.length ≤ 10^5",
  createdBy: "admin",
  testCases: [{
    input: "1 2 3 1",
    output: "true",
    sample: true,
    explanation: "1 appears twice."
  }]
},
];

async function seedProblems() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    await Problem.deleteMany({});
    console.log("Existing problems cleared");

    await Problem.insertMany(problems);
    console.log("Problems seeded successfully");

    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedProblems();
