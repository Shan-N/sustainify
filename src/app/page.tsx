"use client";

import { Button } from '@/components/ui/button';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

const interFont = Inter({
    subsets: ['latin'],
    weight:'400',
});
export default function LandingPage(){
    return (
        <>
        <div className={`${interFont.className} min-h-screen bg-[#050B26]`}>
        <main className={`${interFont.className} bg-[#26300E] flex`}>
            <h2 className='text-white font-extrabold text-2xl md:text-3xl px-4 py-3'><Link href='/'>SUSTAINIFY</Link></h2>
        </main>
        <div className='flex py-10 '>
        <section className={`${interFont.className} text-white text-lg px-3 pt-10 flex flex-col relative md:text-xl`}>
            <div className='flex flex-col relative font-extrabold max-w-60 md:max-w-full md:text-xl'><p className='text-center'>AI-POWERED SUSTAINABLE</p><p className='text-center'>MATERIAL OPTIMIZER</p></div>
            <p className='text-lg font-semibold text-center max-w-56 md:max-w-full pt-5 md:text-xl'>Discover eco-friendly alternatives for your raw materials with just a few clicks. Input your product details, and let our smart engine guide you to greener choices that save the planet and your budget. Join the movement towards sustainability—because every choice counts!"</p>
        <div className='flex pl-14 mt-5 md:justify-center md:items-center md:pl-0 md:pt-10'>
            <Button className='bg-[#EDFAE8] text-black rounded-3xl px-4 font-extrabold text-sm '>
                <Link href='/login'>
                GET STARTED
                </Link>
            </Button>
        </div>
        </section>
        <Image src='https://res.cloudinary.com/dl4tccguh/image/upload/e_background_removal/f_png/v1730875668/1000000253_14_aqitzx.png' alt='landing page' width={150} height={150} className='object-fill' />
        </div>
        </div>
        </>
    )
}