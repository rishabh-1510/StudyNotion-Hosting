import React from 'react'
import CTAButton from './CTAButton';
import HighlightText from './HiglightText';
import { FaArrowRight } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';

const Codeblocks = ({position , heading ,subheading , ctabtn1  , ctabtn2 ,codeblock ,backGroundGradient ,codecolor , active }) => {
  return (
    <div className={`flex ${position} my-20 gap-10 justify-between `}>
        {/* section 1 */}
        <div className='w-[50%] flex flex-col gap-8'>
            {heading}
            <div className='text-richblack-300 font-bold  '>
                {subheading}
            </div>
            <div className='flex gap-7 mt-7'>
                <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto} >
                    <div className='flex gap-2 items-center'>
                        {ctabtn1.btnText}
                        <FaArrowRight/> 
                    </div>
                </CTAButton>

                <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto} >

                        {ctabtn2.btnText}
                </CTAButton>
            </div>
        </div>
          {/* section 2 */}
          
        <div className='h-fit flex flex-row text-10 w-[100%] py-4 lg:w-[500px] relative' >
            {/*HW Bg Gradient */}
            <div className={`absolute w-[373px] h-[257px] bg-white opacity-20 blur-[68px] rounded-full bg-gradient-to-r ${active ? "from-purple-100 via-yellow-1000 to-[#A6FFCB]":"from-[#1Fa2FF] via-[#12D8FA] to-white"} -translate-y-5 -translate-x-10`}>
           </div>
            <div className='txt-center flex flex-col w-[10%] font-inter text-richblack-400 font-bold'>
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
                <p>11</p>
            </div>
            <div className={`w-[90%] flex flex-col font-bold gap-2 font-mono ${codecolor} pr-2`}>
                    <TypeAnimation
                    sequence={[codeblock , 5000 , ""]}
                    repeat={Infinity}
                    cursor={true}
                    style={{
                        whiteSpace:"pre-line",
                        display:"block"
                    }}
                    omitDeletionAnimation={true}
                
                    />
            </div>
                
            
        </div>


    </div>
  )
}

export default Codeblocks