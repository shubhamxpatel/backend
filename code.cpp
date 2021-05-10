#include<bits/stdc++.h>
using namespace std;


vector<int> convertTovector(int n)
{
    vector<int> v;
    while(n)
    {
        v.push_back(n%10);
        n/=10;
    }
    return v;
}
vector<int> mul(vector<int> v,int n)
{
    vector<int> result;
    int carry=0;
    for(auto x:v)
    {
        int y=x*n;
        result.push_back((x*n+carry)%10);
        carry=(x*n+carry)/10;
    }
    if(carry)
    {
        vector<int> p=convertTovector(carry);
        for(auto x:p)
        {
            result.push_back(x);
        }
    }
    return result;
}
vector<int> add(vector<int> a,vector<int> b)
{
    int carry=0,r,i;
    vector<int> result;
    int p=min(a.size(),b.size());
    for(i=0;i<p;i++)
    {
        r=(carry+a[i]+b[i])%10;
        carry=(carry+a[i]+b[i])/10;
        result.push_back(r);
    }
    if(p<a.size())
    {
        for(;i<a.size();i++)
        {
             r=(carry+a[i])%10;
        carry=(carry+a[i])/10;
        result.push_back(r);
        }
    }
    if(p<b.size())
    {
        for(;i<b.size();i++){
            r=(carry+b[i])%10;
        carry=(carry+b[i])/10;
        result.push_back(r);
        }
    }
    if(carry)
    {
        vector<int> p1=convertTovector(carry);
        for(auto x:p1)
        {
            result.push_back(x);
        }
    }
   /* for(auto l:result)
    {
        cout<<l;
    }cout<<endl;*/
    return result;
    
}
vector<int> fact(int i,int n,vector<int> v)
{if(i==n+1)
{
    return v;
}
    vector<int> np=convertTovector(i); 
vector<int> result;
    for(int i=0;i<np.size();i++)
    {
        vector<int> vr;
        for(int j=0;j<i;j++)
        {
            vr.push_back(0);
        }
        vector<int> mulp=mul(v,np[i]);
        for(auto x:mulp)
        {
            vr.push_back(x);
        }
        result=add(result,vr);
    }
    return fact(i+1,n,result);
}
int main()
{
    int n=10000;
    //cin>>n;
    vector<int> v={1};
    vector<int> result;
    result=fact(1,n,v);
    reverse(result.begin(),result.end());
    for(auto l:result)
    {
        cout<<l;
    }
    
}