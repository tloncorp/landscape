import React from 'react';

type ZapIconProps = React.SVGProps<SVGSVGElement> & {
  /**
   * (optional) The color of the icon.
   * Defaults to `white`.
   */
  color?: string;
};

export default function ZapIcon(props: ZapIconProps) {
  return (
    <svg {...props} width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9 18.5C4.02944 18.5 0 14.4706 0 9.5C0 4.52944 4.02944 0.5 9 0.5C13.9706 0.5 18 4.52944 18 9.5C18 14.4706 13.9706 18.5 9 18.5ZM9.00199 4.5C9.48462 4.5 9.87276 4.89709 9.86175 5.37961L9.74851 10.3413C9.73923 10.7478 9.40697 11.0726 9.00027 11.0726C8.59337 11.0726 8.26102 10.7475 8.25202 10.3407L8.14221 5.37901C8.13154 4.89672 8.51958 4.5 9.00199 4.5ZM10 12.9089C9.99545 13.4635 9.53637 13.9089 9.00002 13.9089C8.44548 13.9089 7.99549 13.4635 8.00003 12.9089C7.99549 12.3635 8.44548 11.9181 9.00002 11.9181C9.53637 11.9181 9.99545 12.3635 10 12.9089Z" 
        fill={props.color ?? 'white'}/>
    </svg>
  );
}
