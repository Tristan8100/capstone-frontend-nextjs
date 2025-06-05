'use client';
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogImage,
  MorphingDialogContainer,
} from '@/components/ui/morphing-dialog';
import { XIcon } from 'lucide-react';
import { InView } from '@/components/ui/in-view';
import { motion } from 'motion/react';
import { Tilt } from '@/components/ui/tilt';
export function InViewImagesGrid() {
  return (
    <div className='h-full w-full overflow-auto'>
      <div className='mb-20 py-12 text-center text-sm'>Scroll down</div>
      <div className='flex items-end justify-center'>
        <InView
          viewOptions={{ once: true, margin: '0px 0px -250px 0px' }}
          variants={{
            hidden: {
              opacity: 0,
            },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.09,
              },
            },
          }}
        >
          <div className='columns-2 gap-4 px-8 sm:columns-3 m-2'>
            {[
              'static/alumni1.jpg',
              'static/alumni2.jpg',
                'static/alumni3.jpg',
                'static/alumni4.jpg',
                'static/alumni5.jpg',
                'static/alumni4.png',
            ].map((imgSrc, index) => {
              return (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      filter: 'blur(0px)',
                    },
                  }}
                  key={index}
                  className='mb-4'
                >
                  <MorphingDialog
                      transition={{
                        duration: 0.3,
                        ease: 'easeInOut',
                      }}
                    >
                      <MorphingDialogTrigger>
                        <Tilt rotationFactor={8} isRevese>
                          <MorphingDialogImage
                          src={imgSrc}
                          alt='btech alumni'
                          className='rounded-[4px]'
                        />
                        </Tilt>
                      </MorphingDialogTrigger>
                      <MorphingDialogContainer>
                        <MorphingDialogContent className='relative'>
                          <MorphingDialogImage
                            src={imgSrc}
                            alt='btech alumni'
                            className='h-auto w-full max-w-[90vw] rounded-[4px] object-cover lg:h-[90vh]'
                          />
                        </MorphingDialogContent>
                        <MorphingDialogClose
                          className='fixed right-6 top-6 h-fit w-fit rounded-full bg-white p-1'
                          variants={{
                            initial: { opacity: 0 },
                            animate: {
                              opacity: 1,
                              transition: { delay: 0.3, duration: 0.1 },
                            },
                            exit: { opacity: 0, transition: { duration: 0 } },
                          }}
                        >
                          <XIcon className='h-5 w-5 text-zinc-500' />
                        </MorphingDialogClose>
                      </MorphingDialogContainer>
                    </MorphingDialog>


                </motion.div>
              );
            })}
          </div>
        </InView>
      </div>
    </div>
  );
}
