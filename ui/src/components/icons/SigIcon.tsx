import React from 'react';

type SigIconProps = React.SVGProps<SVGSVGElement>;

export default function SigIcon(props: SigIconProps) {
  return (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4ZM6 2C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18V6C22 3.79086 20.2091 2 18 2H6Z" fill="#666666"/>
      <path d="M8 13L8.38755 12.2249C9.10603 10.7879 11.1088 10.6632 12 12V12C12.8912 13.3368 14.894 13.2121 15.6125 11.7751L16 11" stroke="#666666" stroke-width="2" stroke-linecap="round"/>
    </svg>
  );
}
