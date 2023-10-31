import React, { useState } from 'react'

import Wrapper from '@/components/Wrapper';
import ProductDetailsCarousel from '@/components/ProductDetailsCarousel';
import { IoMdHeartEmpty } from 'react-icons/io';
import RelatedProduct from '@/components/RelatedProduct';
import { fetchDataFromApi } from '@/utils/api';
import { getDiscountedPricePercentage } from '@/utils/helper';
import ReactMarkdown from 'react-markdown';
import { useSelector, useDispatch } from 'react-redux'
import { addToCart } from '@/store/cartSlice';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ProductDetails = ({ product, products }) => {

    const [selectedSize, setSelectedSize] = useState();

    const [showerror, setShowerror] = useState(false)

    const dispatch = useDispatch();

    const p = product?.data?.[0]?.attributes;

    const notify = () => {
        toast.success('Success, Check your cart', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
    }
    return (
        <div className='w-full md:py-20'>
            <ToastContainer />
            <Wrapper>
                <div className='flex flex-col lg:flex-row md:px-10 gap-[50px] lg:gap-[100px]'>
                    {/* left column  */}
                    <div className='w-full md:w-auto flex-[1.5] max-w-[500px] lg:max-w-full mx-auto lg:mx-0'>
                        <ProductDetailsCarousel
                            images={p.image.data}
                        />
                    </div>

                    {/* Right column  */}
                    <div className='flex-[1] py-3'>
                        {/* Product title  */}
                        <div className='text-[34px] font-semibold leading-10 mb-2'>
                            {p.name}
                        </div>

                        {/* Product Subtitle  */}
                        <div className='text-lg font-semibold mb-5'>
                            {p.subtitle}
                        </div>

                        {/* Product Price  */}
                        <div className='flex items-center'>
                            <p className='mr-2 text-lg font-semibold'>
                                MRP : &#8377;{p.price}
                            </p>
                            {p.original_price && (
                                <>
                                    <p className='text-base font-medium line-through'>
                                        &#8377;{p.original_price}
                                    </p>
                                    <p className='ml-auto text-base font-medium text-green-600'>
                                        {
                                            getDiscountedPricePercentage(
                                                p.original_price,
                                                p.price
                                            )
                                        }
                                        %off
                                    </p>
                                </>
                            )}
                        </div>
                        <div className='text-md font-medium text-black/[0.5]'>
                            incl. of taxes
                        </div>
                        <div className='text-md font-medium text-black/[0.5] mb-20'>
                            {`(Also includes all applicable duties)`}
                        </div>

                        {/* Product Sizing  */}
                        <div className='mb-10'>
                            {/*select Heading  */}
                            <div className='flex justify-between mb-2'>
                                <div className='text-md font-semibold
                                '>
                                    Select Size
                                </div>
                                <div className='text-md font-medium text-black/[0.5]'>
                                    Select Guide
                                </div>
                            </div>
                            {/* size boxes  */}
                            <div id='sizesGrid' className='grid grid-cols-3 gap-2'>
                                {p.size.data.map((item, index) => (
                                    <div key={index}
                                        className={`bg-black/[0.1] border rounded-md text-center py-3 font-medium  ${item.enabled ? 'cursor-pointer hover:border-black' : 'cursor-not-allowed bg-black/[0.1] opacity-50'
                                            } ${selectedSize === item.size ? "border-black" : ""}`}
                                        onClick={() => {
                                            setSelectedSize(item.size)
                                            setShowerror(false)
                                        }}
                                    >
                                        {item.size}
                                    </div>
                                ))}

                            </div>

                            {/* Size error mssge  */}
                            {showerror &&
                                <div className='text-red-500 mt-1'>
                                    Size selection is required
                                </div>}
                        </div>

                        {/*Add card and wishilst Buttons  */}
                        <button className='w-full py-4 rounded-full bg-black text-white text-lg font-medium transition-transform active:scale-90 mb-5 hover:bg-green-600'
                            onClick={() => {
                                if (!selectedSize) {
                                    setShowerror(true)
                                    document.getElementById("sizesGrid").scrollIntoView({
                                        block: "center",
                                        behavior: "smooth"
                                    })
                                }else{
                                    dispatch(addToCart({
                                        ...product?.data?.[0],
                                        selectedSize,
                                        oneQuantityPrice : p.price
                                    }));
                                }
                                notify();
                            }}>
                            Add to Card
                        </button>
                        <button className='w-full py-4 rounded-full border border-black text-black font-bold text-lg transition-transform active:scale-90 hover:text-green-600 tracking-widest mb-10 flex items-center justify-center gap-2'>
                            Wishlist
                            <IoMdHeartEmpty size={20} />
                        </button>

                        {/* Product Details  */}
                        <div>
                            <div className='text-lg font-bold mb-5'>
                                Product details
                            </div>

                            <div className='text-md mb-5 markdown'>
                                <ReactMarkdown>
                                    {p.description}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
                <RelatedProduct products={products} />
            </Wrapper>
        </div>
    )
}

export default ProductDetails;

export async function getStaticPaths() {
    const products = await fetchDataFromApi("/api/products?populate=*");
    const paths = products?.data?.map((p) => ({
        params: {
            slug: p.attributes.slug,
        }
    }))

    return {
        paths,
        fallback: false,
    }
}

//getStatticPaths requires using `getStatisProps`
export async function getStaticProps({ params: { slug } }) {
    const product = await fetchDataFromApi(`/api/products?populate=*&filters[slug][$eq]=${slug}`)
    const products = await fetchDataFromApi(`/api/products?populate=*&[filter][slug][$nel]=${slug}`)

    return {
        props: {
            product,
            products
        }
    }
}
