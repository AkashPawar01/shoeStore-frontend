import React from 'react';
import Image from 'next/image';

import { RiDeleteBin6Line } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateCart } from '@/store/cartSlice';

 
const CartItem = ({ data }) => {

    const p = data.attributes;

    const dispatch = useDispatch();

    const updateCartitem = (e, key) => {
        let payload = {
            key,
            val : key === "quantity" ? parseInt(e.target.value) : e.target.value,
            id : data.id
        };
        dispatch(updateCart(payload))
    }

    return (
        <div className='flex py-5 gap-3 md:gap-5 border-b'>
            {/* Product Image  */}
            <div className='shrink-0 aspect-square w-[50px] md:w-[120px]'>
                <Image
                    width={120}
                    height={120}
                    src={p.thumbnail.data.attributes.url}
                    alt={p.name}
                />

            </div>

            {/* Product Details */}
            <div className='w-full flex flex-col'>
                <div className='flex flex-col md:flex-row justify-between'>
                    {/* Product Title  */}
                    <div className='text-lg md:text-2xl font-semibold text-black/[0.8]'>
                        {p.name}
                    </div>

                    {/* Product Subtitle  */}
                    <div className='text-sm md:text-md font-medium text-black/[0.5] block md:hidden'>
                        {p.subtitle}
                    </div>

                    {/* Product's Prize  */}
                    <div className='text-sm md:text-md font-bold text-black/[0.5]'>
                        MRP : &#8377;{p.price}
                    </div>
                </div>

                {/* Product Subtitle  */}
                <div className='text-sm md:text-md font-medium text-black/[0.5]  hidden md:block'>
                    {p.subtitle}
                </div>

                <div className='flex items-center justify-between mt-4'>
                    <div className='flex items-center gap-2 md:gap-10 text-black/[0.5] text-sm md:text-md'>
                        <div className='flex items-center gap-1'>
                            <div className='font-semibold'>Size:</div>
                            <select className='hover:text-black' onChange={(e)=>updateCartitem(e, "selectedSize")}>
                                {p.size.data.map((item, index) =>{
                                    return(
                                        <option
                                        key={index}
                                        value={item.size}
                                        disabled={!item.enabled ? true : false}
                                        selected={data.selectedSize === item.size }
                                        >
                                            {item.size}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>

                        <div className='flex items-center gap-1'>
                            <div className='font-semibold'>Quantity:</div>
                            <select className='hover:text-black'
                            onChange={(e)=>updateCartitem(e, "quantity")}>

                                {Array.from({length:10},(_, index) => index + 1).map((q, i) => {
                                    return (
                                        <option 
                                        key={i}
                                        value={q}
                                        selected={data.quantity === q}
                                        
                                        >{q}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>

                    {/* Delete Icon  */}
                    <RiDeleteBin6Line 
                    onClick={() => dispatch(removeFromCart({id: data.id}))
                }
                    className='cursor-pointer text-black hover:text-red-600 text-[16px] md:text-[20px] transition-all duration-200' />
                </div>
            </div>
        </div>
    )
}

export default CartItem