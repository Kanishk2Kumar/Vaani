import React from 'react'
import { DotPattern } from './magicui/dot-pattern'
import { cn } from '@/lib/utils'

const Hero = () => {
  return (
    <div className='min-h-screen justify-center flex items-center'>
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(600px_circle_at_center,blue,transparent)]",
        )}
      />
        <div className='text-4xl text-center font-aeonik-trial font-thin'>
            Hero Section
        </div>
    </div>
  )
}

export default Hero