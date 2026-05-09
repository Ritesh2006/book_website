import React from 'react'


function Herosection() {
  return (
    <>
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 flex flex-col md:flex-row ">
      
      
      <div className="order-2 w-full md:w-1/2 mt-12 md:mt-32">
      <h1 className="text-4xl font-bold">Hello ,Welcome to exploring {" "}
        <span className="text-pink-500">books world!</span>
        </h1>
        
        <p className="text-gray-600 my-20">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis velit ad voluptatum animi sit. Perferendis vero deleniti, itaque ipsam corrupti quaerat, commodi iusto et excepturi, porro temporibus debitis at numquam!
        </p>

        <label className="input validator">
  <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="2.5"
      fill="none"
      stroke="currentColor"
    >
      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </g>
  </svg>
  <input type="email" placeholder="mail@site.com" required />
</label>
<div className="validator-hint hidden">Enter valid email address</div>
<button className="btn btn-secondary flex my-3">Secondary</button>
        
        </div>
      <div className="order-1 w-full md:w-1/2 ">
      <img src ="bg.jpg" className="h-90 w-auto mt-20 " alt="heroimage" />
      </div>
    </div>

    </>
  );
}

export default Herosection;print("Hello Ritesh, this code is written by your assistant")