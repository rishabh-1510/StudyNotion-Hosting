import React from 'react'
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import HighlightText from '../components/core/HomePage/HiglightText';
import CTAButton from '../components/core/HomePage/CTAButton';
import banner from '../assets/Images/banner.mp4';
import Codeblocks from '../components/core/HomePage/Codeblocks';
import Learningsection from '../components/core/HomePage/Learningsection';
import TimelineSection from '../components/core/HomePage/TimelineSection';
import InstructorSection from '../components/core/HomePage/InstructorSection';
import Footer from "../components/common/Footer";
import Exploremore from '../components/core/HomePage/Exploremore';
import ReviewSlider from '../components/common/ReviewSlider';
import { useSelector } from 'react-redux';
const Home = () => {
  const {token} = useSelector((state)=>state.auth);
  return (
    <div>
        {/* Section1 */}
        <div className='relative mx-auto flex flex-col w-[80%] max-w-maxContent items-center 
      text-white justify-between'>
            <Link to={"/signup"}>
                <div className='group p-1 mt-16 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit flex flex-row'>
                    <div className='flex flex-row items-center rounded-full gap-2 px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
                        <p>Become an Instructor</p>
                        <FaArrowRight className='mt-1'/>
                    </div>
                    
                </div> 
            </Link>
            <div className='text-center text-4xl font-semibold mt-7'>
                Empower Your Future with 
                <HighlightText text={" Coding Skills"}/>
            </div>
            <div className='w-[90%] text-center text-lg font-bold mt-4 text-richblack-300 '>
                With our online coding courses, you can learn at your own pace, from anywhere in the world,
                 and get access to a wealth of resources, including hands-on projects, quizzes, 
                 and personalized feedback from instructors. 
            </div>
            <div className='flex lg:flex-row gap-7 mt-8 sm:flex-col '>
                <CTAButton active={true} linkto={token?"/": "/signup"}>
                    Learn More
                </CTAButton>

                <CTAButton active={false} linkto={token?"/":"/login"}>
                    Book a Demo
                </CTAButton>  
            </div>

            <div className='shadow-richblack-50 mx-3 my-12 shadow-[20px_20px_0px_0px_rgba(245,245,245,1)] w-full  '>
                <video
                muted
                loop
                autoPlay   
                >
                    <source src={banner}/>   

                </video>
            </div>

            {/* Code section 1 */}

            <div>
                <Codeblocks position={"lg:flex-row sm:flex-col"} active={true} heading={<div className='text-4xl font-semibold'>Unlock Your 
                <HighlightText text={" coding potential"}/> with our online courses</div>} subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you"}
                    ctabtn1={{
                        btnText :"Try it Yourself",
                        linkto={token?"/catalog/devops":"/signup"},
                        active:true,
                        
                    }}
                    ctabtn2={{
                        btnText :"Learn More",
                        linkto={token?"/catalog/devops":"/login"},
                        active:false,
                        
                    }}

                    codeblock={`<!DOCTYPE html>\n <html>\n head><>Example</\ntitle><linkrel="stylesheet"href="styles.css>\n /head>\nbody>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two<\n/a><ahref="three/">Three</a>\n/nav>"`}
                    codecolor={"text-yellow-25"}
                />

            </div>

                        {/* Code section 2*/}

            <div>
                <Codeblocks position={"lg:flex-row-reverse sm:flex-col"} active={false} heading={<div className='text-4xl font-semibold'>Unclock Your 
                <HighlightText text={" coding potential"}/> with our online courses</div>} subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you"}
                    ctabtn1={{
                        btnText :"Try it Yourself",
                        linkto:token?"/":"/signup",
                        active:true,
                        
                    }}
                    ctabtn2={{
                        btnText :"Learn More",
                        linkto:token?"/":"/login",
                        active:false,
                        
                    }}

                    codeblock={`<!DOCTYPE html>\n <html>\n head><>Example</\ntitle><linkrel="stylesheet"href="styles.css>\n /head>\nbody>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two<\n/a><ahref="three/">Three</a>\n/nav>"`}
                    codecolor={"text-yellow-25"}
                />
                <Exploremore/>
            </div>
            
        </div>

        
        {/* Section 2 */}

        <div className='bg-puregreys-5 text-richblack-700 '>
            <div className='homepage_bg h-[333px]'>
                <div  className='w-11/12 max-w-content flex flex-col items-center gap-5 mx-auto'>
                    <div className='h-[150px]'></div>
                    <div className='flex lg:flex-row gap-7 text-white sm:flex-col'>
                         <CTAButton active={true} linkto={token?/"":"/signup"}>
                            <div className='flex flex-row items-center justify-center gap-3'>
                                <div>
                                Explore all Catalog
                                </div>
                                <FaArrowRight/>
                            </div>
                            
                         </CTAButton>
                         <CTAButton active={false} linkto={token?"/":"/signup"}>
                            <div>
                                Learn more

                            </div>
                         </CTAButton>
                    </div>

                </div>
            </div>

            <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7 '>
                <div className='flex lg:flex-row sm:flex-col gap-5 mb-10 mt-[95px] lg:items-start'>
                    <div className='text-4xl font-semibold lg:w-[45%] lg:text-left'>
                        Get the Skills you need for a 
                        <HighlightText text={" Job that is in demand"}/>
                    </div>
                    <div className='flex flex-col gap-10 w-[40%] items-start lg:items-start'>
                        <div className=' text-[16px] '>
                        The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                        
                        </div>
                        <div>
                            <CTAButton active={true} linkto={token?"/":"/signup"}>
                                Learn More
                            </CTAButton>
                        </div>
                    </div>
                    
                </div>
                <TimelineSection/>
                <Learningsection/>
                
            </div>
            
        </div>


        {/* Section 3 */}
        <div className='w-11/12 mx-auto max-w-maxContent flex flex-col justify-between items-center gap-8 first-letter bg-richblack-900 text-white  '>
            <InstructorSection/>
            <h2 className='text-center text-4xl  '>Review from other Learners</h2>
            {/* Review slider */}
            
        </div>
        <ReviewSlider/>

        {/* Footer  */}
        <Footer/>
    </div>
  )
}

export default Home
