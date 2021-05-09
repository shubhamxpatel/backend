#include<bits/stdc++.h>
using namespace std;
int check(int k,int arr[],int a,int b,int n)
{
    int m=k;
    int r=a-b;
    int q=b*m;
    for(int i=0;i<n;i++)
    {
        int x=((arr[i]-q)/r+1<=0)?0:(arr[i]-q)/r+1;
        if(k>=x)
        {
            k-=x;
        }
        else
        {
            return 0;
        }

    }
    return 1;
}
int solve(int lo,int hi,int arr[],int a,int b,int n)
{
    int mid=(lo+hi)/2;
    cout<<mid<<" "<<check(mid,arr,a,b,n)<<endl;
    if(check(mid,arr,a,b,n))
    {
        if(check(mid-1,arr,a,b,n))
        {
            return solve(lo,mid-1,arr,a,b,n);
        }
        else
        {
            return mid;
        }
    }
    else
    {
        return solve(mid+1,hi,arr,a,b,n);
    }
}
int main()
{
    srand(time(0));
    int a,b,n;
    cin>>a>>b>>n;
    //a=rand()%300+15;
    //b=rand()%300+15;
    //n=rand()%100+5;
    if(a<b)
    {
        swap(a,b);

    }
    cout<<a<<" "<<b<<" "<<n<<endl;
    int arr[]={14,25,19,13,38};
    for(int i=0;i<n;i++)
    {
        cin>>arr[i];
        //arr[i]=rand()%10000000;
        //cout<<arr[i]<<" ";
    }//cout<<endl;

    sort(arr,arr+n);
    int lo=0;
    int hi=arr[n-1]/b +1;
    cout<<lo<<" "<<hi<<endl;
    cout<<solve(lo,hi,arr,a,b,n);

}