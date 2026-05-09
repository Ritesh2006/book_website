import React from 'react'

function Card() {
  return (
    <div className='flex gap-5 max-w-screen-2xl container mx-auto md:px-20 px-4'>
      <>
        <div className="card bg-base-400 w-96 shadow-sm ">
  <figure>
    <img
      src="https://m.media-amazon.com/images/I/61GVwL3i1cL._AC_UF894,1000_QL80_.jpg"
      alt="Shoes" />
  </figure>
  <div className="card-body">
    <h2 className="card-title">
      Special edition Book
      <div className="badge badge-secondary">NEW</div>
    </h2>
    <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
    <div className="card-actions justify-end cursor-pointer">
      <div className="badge badge-outline-none hover bg-gray-300">Buy Now</div>
      <div className="badge badge-outline-none hover bg-pink-500">Add to cart</div>
    </div>
  </div>
</div>


        <div className="card bg-base-100 w-96 shadow-sm">
  <figure>
    <img
      src="https://www.kingwoodcreations.com/wp-content/uploads/2021/05/listen-to-love-friends-to-lovers-conetemporary-romance-premade-cover.jpg"
      alt="Shoes" />
  </figure>
  <div className="card-body">
    <h2 className="card-title">
      New Novel
      <div className="badge badge-secondary">NEW</div>
    </h2>
    <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
    <div className="card-actions justify-end cursor-pointer">
      <div className="badge badge-outline-none hover bg-gray-300">Buy Now</div>
      <div className="badge badge-outline-none  hover bg-pink-500">Add to cart</div>
    </div>
  </div>
</div>


        <div className="card bg-base-100 w-96 shadow-sm">
  <figure>
    <img
      src="https://m.media-amazon.com/images/I/81iNAbTRejL._AC_UF1000,1000_QL80_.jpg"
      alt="Shoes" />
  </figure>
  <div className="card-body">
    <h2 className="card-title">
      New Novel
      <div className="badge badge-secondary">NEW</div>
    </h2>
    <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
    <div className="card-actions justify-end cursor-pointer">
      <div className="badge badge-outline-none hover bg-gray-300">Buy Now</div>
      <div className="badge badge-outline-none hover bg-pink-500 shadow-2xl">Add to cart</div>
    </div>
  </div>
</div>
      </>
    </div>
  )
}

export default Card