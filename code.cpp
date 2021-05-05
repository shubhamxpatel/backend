#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    map<pair<string,string>,bool> mp;
    bool isScramble(string s1, string s2) {
        cout<<s1<<" "<<s2<<endl;
        //string s3=s2;
        if(mp.find({s1,s2})!=mp.end())
        {
            return mp[{s1,s2}];
        }
        
        if(s1.size()<=2)
        {
            if(s1==s2)
            {
                return mp[{s1,s2}]=true;
            }
            reverse(s1.begin(),s1.end());
            if(s1==s2)
            {
                return mp[{s1,s2}]=true;
            }
            return mp[{s1,s2}]=false;
        }
        bool ans=false;
        //reverse(s3.begin(),s3.end());
        int n=s2.size();
        for(int i=0;i<s1.size()-1;i++)
        {
            ans=ans|(isScramble(s1.substr(0,i+1),s2.substr(0,i+1))&isScramble(s1.substr(i+1),s2.substr(i+1)))|(isScramble(s1.substr(n-i-1),s2.substr(0,i+1))&isScramble(s1.substr(0,n-i-1),s2.substr(i+1)));
            if(ans==true){return mp[{s1,s2}]=ans;}
        }
        return mp[{s1,s2}]=ans;
        
    }
};
int main()
{
    Solution sol;
    cout<<sol.isScramble("abcdbdacbdac",
"bdacabcdbdac")<<endl;
}