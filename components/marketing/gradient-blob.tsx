import { cn } from '@/lib/utils';
import React from 'react';
import { BlurFade, FadeIn } from './hero/blur-fade';

interface GradientBlobOneProps {
  className?: string;
  colors: string[];
}

export function GradientBlob({ className = '', colors }: GradientBlobOneProps) {
  return (
    <div 
      className={cn(
        'absolute rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-[128px] animate-blob',
        className
      )}
      style={{
        background: `linear-gradient(${colors.join(', ')})`
      }}
    />
  );
}

export function GradientBlobTwo() {
  return (
    <FadeIn>
    <>
      <div className="blur-3xl opacity-20 dark:opacity-60 absolute right-64 top-2 animate-[spin_20s_linear_infinite]">
        <svg className="coolshapes misc-9" height="400" width="400" fill="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#cs_clip_1_misc-9)">
            <mask height="200" id="cs_mask_1_misc-9" style={{"maskType":"alpha"}} width="200" x="0" y="0" maskUnits="userSpaceOnUse">
              <path d="M8.475 78.884C27.008 22.9 70.833 4.108 89.905 1.464c110.239-15.283 132.313 92.87 90.046 148.772-36.448 48.204-100.638 57.186-139.16 44.676C6.86 183.894-11.983 140.686 8.475 78.884z" fill="#fff"/>
            </mask>
            <g mask="url(#cs_mask_1_misc-9)">
              <path d="M200 0H0v200h200V0z" fill="#484bf869"/>
              <path d="M200 0H0v200h200V0z" fill="url(#paint0_linear_748_4999_1)"/>
              <g filter="url(#filter0_f_748_4999)">
                <ellipse cx="143.777" cy="167.536" fill="#ff58e319" rx="91.994" ry="58.126" transform="rotate(-33.875 143.777 167.536)"/>
                <ellipse cx="68.482" cy="38.587" fill="#0e1111" rx="69.531" ry="47.75" transform="rotate(-26.262 68.482 38.587)"/>
              </g>
            </g>
          </g>
          <defs>
            <filter height="412.095" id="filter0_f_748_4999" width="384.137" x="-77.372" y="-94.144" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood result="BackgroundImageFix" floodOpacity="0"/>
              <feBlend result="shape" in="SourceGraphic" in2="BackgroundImageFix"/>
              <feGaussianBlur result="effect1_foregroundBlur_748_4999" stdDeviation="40"/>
            </filter>
            <linearGradient id="paint0_linear_748_4999_1" gradientUnits="userSpaceOnUse" x1="158.5" x2="29" y1="12.5" y2="200">
              <stop stopColor="#0e6eff46"/>
              <stop offset="0.5" stopColor="#2234a868"/>
              <stop offset="1" stopColor="#ff58e34e"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="blur-3xl opacity-20 dark:opacity-50 absolute left-0 top-0 animate-[bounce_8s_ease-in-out_infinite]">
        <svg className="coolshapes misc-9" height="400" width="400" fill="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#cs_clip_1_misc-9_2)">
            <mask height="200" id="cs_mask_1_misc-9_2" style={{"maskType":"alpha"}} width="200" x="0" y="0" maskUnits="userSpaceOnUse">
              <path d="M8.475 78.884C27.008 22.9 70.833 4.108 89.905 1.464c110.239-15.283 132.313 92.87 90.046 148.772-36.448 48.204-100.638 57.186-139.16 44.676C6.86 183.894-11.983 140.686 8.475 78.884z" fill="#fff"/>
            </mask>
            <g mask="url(#cs_mask_1_misc-9_2)">
              <path d="M200 0H0v200h200V0z" fill="#d420ce4d"/>
              <path d="M200 0H0v200h200V0z" fill="url(#paint0_linear_748_4999_2)"/>
              <g filter="url(#filter0_f_748_4999)">
                <ellipse cx="143.777" cy="167.536" fill="#1C1C1C" rx="91.994" ry="58.126" transform="rotate(-33.875 143.777 167.536)"/>
                <ellipse cx="68.482" cy="38.587" fill="#ff58e328" rx="69.531" ry="47.75" transform="rotate(-26.262 68.482 38.587)"/>
              </g>
            </g>
          </g>
          <defs>
            <filter height="412.095" id="filter0_f_748_4999_2" width="384.137" x="-77.372" y="-94.144" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood result="BackgroundImageFix" floodOpacity="0"/>
              <feBlend result="shape" in="SourceGraphic" in2="BackgroundImageFix"/>
              <feGaussianBlur result="effect1_foregroundBlur_748_4999" stdDeviation="40"/>
            </filter>
            <linearGradient id="paint0_linear_748_4999_2" gradientUnits="userSpaceOnUse" x1="158.5" x2="29" y1="12.5" y2="200">
              <stop stopColor="#2D2D2D"/>
              <stop offset="0.5" stopColor="#0e6eff6a"/>
              <stop offset="1" stopColor="#ff58e33c"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="blur-3xl opacity-20 dark:opacity-30 absolute -right-32 bottom-24 animate-[spin_15s_linear_infinite] hidden md:block">
        <svg className="coolshapes" height="400" width="400" fill="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#cs_clip_1_misc-9_3)">
            <mask height="200" id="cs_mask_1_misc-9_3" style={{"maskType":"alpha"}} width="200" x="0" y="0" maskUnits="userSpaceOnUse">
              <path d="M8.475 78.884C27.008 22.9 70.833 4.108 89.905 1.464c110.239-15.283 132.313 92.87 90.046 148.772-36.448 48.204-100.638 57.186-139.16 44.676C6.86 183.894-11.983 140.686 8.475 78.884z" fill="#fff"/>
            </mask>
            <g mask="url(#cs_mask_1_misc-9_3)">
              <path d="M200 0H0v200h200V0z" fill="#4834d44d"/>
              <path d="M200 0H0v200h200V0z" fill="url(#paint0_linear_748_4999_3)"/>
              <g filter="url(#filter0_f_748_4999)">
                <ellipse cx="143.777" cy="167.536" fill="#3469d42a" rx="91.994" ry="58.126" transform="rotate(-33.875 143.777 167.536)"/>
                <ellipse cx="68.482" cy="38.587" fill="#d434d450" rx="69.531" ry="47.75" transform="rotate(-26.262 68.482 38.587)"/>
              </g>
            </g>
          </g>
          <defs>
            <linearGradient id="paint0_linear_748_4999_3" gradientUnits="userSpaceOnUse" x1="158.5" x2="29" y1="12.5" y2="200">
              <stop stopColor="#3457d443"/>
              <stop offset="0.5" stopColor="#d434d4"/>
              <stop offset="1" stopColor="#4134d4"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="blur-3xl opacity-20 dark:opacity-20 absolute -left-32 -top-80 animate-[bounce_12s_ease-in-out_infinite] hidden md:block">
        <svg className="coolshapes" height="400" width="400" fill="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#cs_clip_1_misc-9_4)">
            <mask height="200" id="cs_mask_1_misc-9_4" style={{"maskType":"alpha"}} width="200" x="0" y="0" maskUnits="userSpaceOnUse">
              <path d="M8.475 78.884C27.008 22.9 70.833 4.108 89.905 1.464c110.239-15.283 132.313 92.87 90.046 148.772-36.448 48.204-100.638 57.186-139.16 44.676C6.86 183.894-11.983 140.686 8.475 78.884z" fill="#fff"/>
            </mask>
            <g mask="url(#cs_mask_1_misc-9_4)">
              <path d="M200 0H0v200h200V0z" fill="#8934d44d"/>
              <path d="M200 0H0v200h200V0z" fill="url(#paint0_linear_748_4999_4)"/>
              <g filter="url(#filter0_f_748_4999)">
                <ellipse cx="143.777" cy="167.536" fill="#3469d4" rx="91.994" ry="58.126" transform="rotate(-33.875 143.777 167.536)"/>
                <ellipse cx="68.482" cy="38.587" fill="#7934d44c" rx="69.531" ry="47.75" transform="rotate(-26.262 68.482 38.587)"/>
              </g>
            </g>
          </g>
          <defs>
            <linearGradient id="paint0_linear_748_4999_4" gradientUnits="userSpaceOnUse" x1="158.5" x2="29" y1="12.5" y2="200">
              <stop stopColor="#7734d4"/>
              <stop offset="0.5" stopColor="#34d4d4"/>
              <stop offset="1" stopColor="#d434d4"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
    </FadeIn>
  );
}