import React from 'react'

const PurchaseHistoryCard = ({purchaseData}) => {
  const options = {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    };
  return (
    <div>
        
        <div>
            {
          purchaseData.map((purchase)=>(
            <div key={purchase._id} className='flex flex-row border border-richblack-700 p-4 rounded-lg mb-4 items-center gap-10'>
              <div className='h-16 w-16 rounded-lg object-cover'><img src={purchase?.course?.thumbnail}/></div>
              <div className='w-full flex flex-col ' >
                <div className='flex flex-row items-center justify-between mb-4 border-b border-richblack-700 pb-2 font-semibold text-richblack-50'>
                    <div>Course Name</div>
                    <div>Category</div>
                    <div>Price</div>
                    <div>Purchased On:</div>
                    
                </div>
                <div  className='flex flex-row items-center justify-between mb-4'>
                    <div>{purchase?.course?.courseName}</div>
                    <div>{purchase?.course?.category?.name}</div>
                    <div>{purchase?.course?.price}</div>
                    <div>{
                          purchase?.purchasedAt ? 
                          new Date(purchase.purchasedAt).toLocaleDateString('en-GB', options) : 
                          'Date not available'
                         }</div>
                </div>
            </div>
            </div>
            
          ))
        }
        </div>
    </div>
  )
}

export default PurchaseHistoryCard