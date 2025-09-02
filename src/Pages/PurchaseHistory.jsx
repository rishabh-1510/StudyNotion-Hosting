import React, { useEffect, useState } from 'react'
import { fetchPurchaseHistory } from '../services/operations/courseDetailsAPI';
import { useSelector } from 'react-redux';
import PurchaseHistoryCard from '../components/core/purchaseHistory/PurchaseHistoryCard';

const PurchaseHistory = () => {
    const [purchaseData , setPurchaseData] = useState([]);
    const {token} = useSelector((state)=>state.auth);
    const {user} = useSelector((state)=>state.profile); 

    const options = {
        day: 'numeric',
        month: 'short',
        year: 'numeric' 
  };
    useEffect(()=>{
        const getPurchaseHistory = async()=>{
            try{
                const response = await fetchPurchaseHistory({id:user._id},token);
                if(response){
                    setPurchaseData(response);
                    console.log("purchase history is ",response);
                }
                else{
                    console.log("Could not fetch purchase history");
                }
            }catch(err){
                console.log("Error in fetching purchase history" , err);
            }
        }
        getPurchaseHistory();
    },[]);

  return (  
    <div className='text-richblack-100'>
        <div className='text-2xl text-center pb-5 font-bold '>Purchase History</div>
       {
        purchaseData.length == 0 ?(<div>No Purchases Found</div>):(<div>
            <PurchaseHistoryCard purchaseData={purchaseData}/>
        </div>) 
       }
    </div>
  )
}

export default PurchaseHistory